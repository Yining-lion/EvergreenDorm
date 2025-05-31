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

export function useMessages(roomId: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!roomId) return;

        const q = query(
        collection(db, "chatRooms", roomId, "messages"),
        orderBy("createdAt", "asc")
        );

        const senderCache = new Map<string, { name: string; avatar: string }>();

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const docs = snapshot.docs;
            const msgs: Message[] = [];

            for (const docSnap of docs) {
                const data = docSnap.data();
                const msg: Message = {
                    id: docSnap.id,
                    senderId: data.senderId,
                    content: data.content,
                    createdAt: data.createdAt,
                    localTimestamp: data.localTimestamp || Date.now(),
                    attachments: data.attachments || [],
                };

                const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID!;
                // 管理員身份判斷
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
        setLoading(false);
        });

        return () => unsubscribe();
    }, [roomId]);

    return { messages, loading };
}
