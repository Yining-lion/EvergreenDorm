"use client"

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type Message = {
  id: string;
  senderId: string;
  content: string;
  createdAt: Timestamp;
  localTimestamp: number;
  attachments?: string[];
  senderProfile?: {
    name: string;
    avatar: string;
  };
}

export function useMessages(roomId: string, userId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [unreadStartIndex, setUnreadStartIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!roomId || !userId) return;

        let unsubscribe: () => void = () => {}; // 預設為空函式，避免報錯

        const fetch = async () => {
            // 等待 100ms，讓 serverTimestamp 有時間寫入
            await new Promise((res) => setTimeout(res, 100));
            const readDoc = await getDoc(doc(db, "chatRooms", roomId, "readStatus", userId));
            const lastRead = readDoc.data()?.lastRead;
            const lastReadTime = lastRead instanceof Timestamp ? lastRead.toMillis() : 0; // toMillis：將 Firestore Timestamp 時間轉成毫秒數字，以利 number 比較

            const q = query(collection(db, "chatRooms", roomId, "messages"), orderBy("createdAt", "asc"));

            const senderCache = new Map<string, { name: string; avatar: string }>();

            unsubscribe = onSnapshot(q, async (snapshot) => {
                const docs = snapshot.docs;
                const msgs: Message[] = [];
                let unreadIndex: number | null = null;

                for (let i = 0; i < docs.length; i++) {
                    const docSnap = docs[i];
                    const data = docSnap.data();
                    const msg: Message = {
                        id: docSnap.id,
                        senderId: data.senderId,
                        content: data.content,
                        createdAt: data.createdAt,
                        localTimestamp: data.localTimestamp || Date.now(),
                        attachments: data.attachments || [],
                    };

                    const createdAtMs = data.createdAt?.toMillis?.() ?? 0;
                    
                    if (unreadIndex === null && createdAtMs > lastReadTime && data.senderId !== userId) {
                        unreadIndex = i; 
                        // console.log(roomId, unreadIndex);
                    }

                    const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID!;
                    if (msg.senderId === ADMIN_UID) {
                        msg.senderProfile = {
                        name: "管理員",
                        avatar: "/icons/member/Headshot.svg",
                        };
                    } else {
                        if (senderCache.has(msg.senderId)) {
                            msg.senderProfile = senderCache.get(msg.senderId);
                        } else {
                            const userRef = doc(db, "members", msg.senderId);
                            const userSnap = await getDoc(userRef);
                            if (userSnap.exists()) {
                                const userData = userSnap.data();
                                const profile = {
                                name: userData.name || "未知用戶",
                                avatar: userData.photoURL || "/icons/member/Headshot.svg",
                                };
                                senderCache.set(msg.senderId, profile);
                                msg.senderProfile = profile;
                            }
                        }
                    }
                    msgs.push(msg);
                }

                setMessages(msgs);
                setUnreadStartIndex(unreadIndex);
                setLoading(false);
            });
        }

        fetch();
        return () => unsubscribe();

    }, [roomId, userId]);

    return { messages, loading, unreadStartIndex };
}