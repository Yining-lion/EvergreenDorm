"use client"

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { DocumentData, QuerySnapshot } from "firebase/firestore";

export type ChatRoom = {
    id: string;
    name: string;
    type: "global" | "BF" | "private"; // BF 是 building + floor // ex: "C1"
    BF?: string;
    members?: string[];
    hasUnread?: boolean;
}

export function useChatRooms(
    userId: string, 
    role: "member" | "admin",
    filterType?: "system" | "private", // 給 admin 用的
    BF?: string, 
    roomType?: "shared" | "suite"
) {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    const fetchRooms = async () => {
            const roomRef = collection(db, "chatRooms");
            const allRooms: ChatRoom[] = [];

            const addRoomsFromSnapshot = async (snap: QuerySnapshot<DocumentData>) => {
                for (const docSnap of snap.docs) {
                    const data = docSnap.data() as Omit<ChatRoom, "id">;
                    const roomId = docSnap.id;

                    let hasUnread = false;

                    try {
                        const readRef = doc(db, "chatRooms", roomId, "readStatus", userId);
                        const readSnap = await getDoc(readRef);
                        const lastRead = readSnap.exists() ? readSnap.data().lastRead?.toMillis?.() ?? null : null;
                        
                        const messageRef = collection(db, "chatRooms", roomId, "messages");
                        const latestMsgQuery = query(messageRef, orderBy("createdAt", "desc"), limit(1));
                        const latestSnap = await getDocs(latestMsgQuery);

                        if (!latestSnap.empty && lastRead) {
                            const latest = latestSnap.docs[0].data();
                            const latestTime = latest.createdAt?.toMillis?.() ?? 0;
                            // console.log(`Room: ${roomId}, latestTime: ${latestTime}`);
                            // console.log(`Room: ${roomId}, lastRead: ${lastRead}`);
                            hasUnread = latestTime > lastRead;
                            // console.log(`Room: ${roomId}, hasUnread: ${hasUnread}`);
                        }
                    } catch (error) {
                        console.warn(`取得 unread 判斷失敗: ${roomId}`, error);
                    }

                    allRooms.push({ id: roomId, ...data, hasUnread });
                }
            };

            if (role === "admin") {
                // 管理員：全部聊天室 + 所有 BF + 所有 private 聊天
                if (filterType === "system") {
                    // global + BF 聊天室
                    const globalSnap = await getDocs(query(roomRef, where("type", "==", "global")));
                    await addRoomsFromSnapshot(globalSnap);
                    const bfSnap = await getDocs(query(roomRef, where("type", "==", "BF")));
                    await addRoomsFromSnapshot(bfSnap);
                    
                } else if (filterType === "private") {
                    // private 聊天室
                    const privateSnap = await getDocs(query(roomRef, where("type", "==", "private")));
                    await addRoomsFromSnapshot(privateSnap);
                }

            } else {
                // 會員：分段查詢
                // 1. global 聊天室（所有人都能看到）
                const globalSnap = await getDocs(query(roomRef, where("type", "==", "global")));
                await addRoomsFromSnapshot(globalSnap);

                // 2. private 聊天室
                const privateSnap = await getDocs(query(roomRef, where("type", "==", "private"), where("members", "array-contains", userId)));
                await addRoomsFromSnapshot(privateSnap);

                // 3. BF 群組（針對雅房者）
                if (roomType === "shared" && BF) {
                    const bfSnap = await getDocs(query(roomRef, where("type", "==", "BF"), where("BF", "==", BF)));
                    await addRoomsFromSnapshot(bfSnap);
                }
            }

            setChatRooms(allRooms);
        };

    useEffect(() => {
        if (userId) fetchRooms();
    }, [userId, role, filterType, BF, roomType]);

    return { chatRooms, refresh: fetchRooms };
}