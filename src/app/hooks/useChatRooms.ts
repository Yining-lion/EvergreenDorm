"use client"

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type ChatRoom = {
    id: string;
    name: string;
    type: "global" | "BF" | "private"; // BF 是 building + floor // ex: "C1"
    BF?: string;
    members?: string[];
}

export function useChatRooms(
    userId: string, 
    role: "member" | "admin",
    filterType?: "system" | "private", // 給 admin 用的
    BF?: string, 
    roomType?: "shared" | "suite"
) {
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const roomRef = collection(db, "chatRooms");
            const allRooms: ChatRoom[] = [];

            if (role === "admin") {
                // 管理員：全部聊天室 + 所有 BF + 所有 private 聊天
                if (filterType === "system") {
                    // global + BF 聊天室
                    const globalQuery = query(roomRef, where("type", "==", "global"));
                    const globalSnap = await getDocs(globalQuery);
                    globalSnap.forEach((doc) => {
                        const data = doc.data() as Omit<ChatRoom, "id">;
                        allRooms.push({ id: doc.id, ...data });
                    });

                    const bfQuery = query(roomRef, where("type", "==", "BF"));
                    const bfSnap = await getDocs(bfQuery);
                    bfSnap.forEach((doc) => {
                        const data = doc.data() as Omit<ChatRoom, "id">;
                        allRooms.push({ id: doc.id, ...data });
                    });
                } else if (filterType === "private") {
                    // private 聊天室
                    const privateQuery = query(roomRef, where("type", "==", "private"));
                    const privateSnap = await getDocs(privateQuery);
                    privateSnap.forEach((doc) => {
                        const data = doc.data() as Omit<ChatRoom, "id">;
                        allRooms.push({ id: doc.id, ...data });
                    });
                }

            } else {
                // 會員：分段查詢
                // 1. global 聊天室（所有人都能看到）
                const globalQuery = query(roomRef, where("type", "==", "global"));
                const globalSnap = await getDocs(globalQuery);
                globalSnap.forEach((doc) => {
                    const data = doc.data() as Omit<ChatRoom, "id">;
                    allRooms.push({ id: doc.id, ...data });
                });

                // 2. private 聊天室
                const privateQuery = query(roomRef,
                    where("type", "==", "private"),
                    where("members", "array-contains", userId)
                );
                const privateSnap = await getDocs(privateQuery);
                privateSnap.forEach((doc) => {
                    const data = doc.data() as Omit<ChatRoom, "id">;
                    allRooms.push({ id: doc.id, ...data });
                });

                // 3. BF 群組（針對雅房者）
                if (roomType === "shared" && BF) {
                    const bfQuery = query(roomRef,
                        where("type", "==", "BF"),
                        where("BF", "==", BF)
                    );
                    const bfSnap = await getDocs(bfQuery);
                    bfSnap.forEach((doc) => {
                        const data = doc.data() as Omit<ChatRoom, "id">;
                        allRooms.push({ id: doc.id, ...data });
                    });
                }
            }
            setChatRooms(allRooms);
        };

        if (userId) fetchRooms();

    }, [userId, role, BF, roomType]);

    return chatRooms;
}
