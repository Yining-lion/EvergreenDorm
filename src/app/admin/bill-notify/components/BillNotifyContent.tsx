"use client";

import { getDocs, getDoc, doc, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/auth/authContext";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { getTaiwanYearMonth } from "../../components/bill/getTaiwanYearMonth";

type Member = {
  uid: string;
  name: string;
  roomNumber: string;
  customMessage: string;
};

type PreviewMessage = {
  roomNumber: string;
  name: string;
  message: string;
};

export default function BillNotifyContent() {
    const { user, loading } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [sending, setSending] = useState(false);

    const privateRooms = useChatRooms(user?.uid ?? "", user?.role ?? "admin", "private");

    const docId = getTaiwanYearMonth();
  
    useEffect(() => {
        const fetchData = async () => {
            const elecMessagesSnapshot  = await getDoc(doc(db, "messagePreview", docId));
            if (!elecMessagesSnapshot.exists()) return;
            const elecMessagesData = elecMessagesSnapshot.data();
            const messages: PreviewMessage[] = elecMessagesData.messages;
            

            const q = query(collection(db, "members"), orderBy("roomNumber"));
            const snapshot = await getDocs(q);
            const data: Member[] = [];

            snapshot.forEach((doc) => {

                const d = doc.data();
                const matched  = messages.find((m) => m.roomNumber === d.roomNumber && m.name === d.name)

                data.push({
                    uid: doc.id,
                    name: d.name,
                    roomNumber: d.roomNumber,
                    customMessage: matched?.message ?? "",
                });
            });

            setMembers(data);
            setSelectedIds(new Set(data.map((m) => m.uid))); // 預設全選
        };

            fetchData();
    }, []);

    const filtered = useMemo(() => {
        const kw = search.trim().toLowerCase();
        return members.filter(
        (m) =>
            m.name.toLowerCase().includes(kw) ||
            m.roomNumber.toLowerCase().includes(kw)
        );
    }, [search, members]);

    const toggleSelection = (uid: string, checked: boolean) => {
        setSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(uid);
            } else {
                newSet.delete(uid);
            }
            return newSet;
        });
    };

    const handleChange = (uid: string, newMessage: string) => {
        setMembers((prev) =>
            prev.map((m) =>
                m.uid === uid ? { ...m, customMessage: newMessage } : m
            )
        );
    };

    const handleSend = async () => {
        if (!user || sending) return;

        const membersToSend = members.filter((m) => selectedIds.has(m.uid));
            if (membersToSend.length === 0) {
            alert("請選擇要通知的對象");
            return;
        }

        setSending(true);

        try {
            for (const member of membersToSend) {
                const room = privateRooms.find((r) => r.members?.[0] === member.uid);
                if (!room) continue;

                await addDoc(collection(db, "chatRooms", room.id, "messages"), {
                senderId: user.uid,
                content: member.customMessage,
                createdAt: serverTimestamp(),
                localTimestamp: Date.now(),
                });
            }
            alert("訊息已成功發送！");

        } catch (err) {
            console.error("發送失敗", err);
            alert("發送失敗，請稍後再試");

        } finally {
            setSending(false);
        }
    };

    if (loading || !user) return <LoadingSpinner />;

    return (
        <div className="flex flex-col items-end">
            {/* 搜尋框 */}
            <input
                type="text"
                placeholder="輸入房號或姓名"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4 p-2 bg-white focus:outline-0"
            />

            {/* 表格 */}
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center">
                    <thead>
                        <tr className="h-12">
                        <th>房號</th>
                        <th>姓名</th>
                        <th>預覽訊息</th>
                        <th>通知</th>
                        <th>編輯</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((member) => {
                        const selected = selectedIds.has(member.uid);
                        const isEditing = editingId === member.uid;

                        return (
                            <tr key={member.uid} className="h-12 hover:bg-green-50">
                            <td className="border-t border-admin-gray">{member.roomNumber}</td>
                            <td className="border-t border-admin-gray">{member.name}</td>
                            <td className="border-t border-admin-gray">
                                {isEditing ? (
                                <input
                                    type="text"
                                    value={member.customMessage}
                                    onChange={(e) =>handleChange(member.uid, e.target.value)}
                                    className="bg-admin-gray text-center w-full"
                                />
                                ) : (
                                <span>{member.customMessage}</span>
                                )}
                            </td>
                            <td className="border-t border-admin-gray">
                                <input
                                type="checkbox"
                                checked={selected}
                                onChange={(e) =>
                                    toggleSelection(member.uid, e.target.checked)
                                }
                                className="size-5"
                                />
                            </td>
                            <td className="border-t border-admin-gray">
                                {isEditing ?
                                (<img
                                src="/icons/admin/Check.svg" 
                                alt="check" 
                                className="size-10 cursor-pointer mx-auto"
                                onClick={() => setEditingId(null)}
                                >
                                </img>) :
                                (<div className="flex justify-center items-center">
                                    <img src="/icons/admin/Edit.svg" alt="edit" className="size-7 cursor-pointer ml-2" onClick={() => setEditingId(member.uid)}></img>
                                </div>)}
                            </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* 發送按鈕 */}
            <div className="mt-10 p-4">
                <button
                onClick={handleSend}
                disabled={sending}
                className="bg-primary-green hover:bg-green-700 text-white px-6 py-2 mt-2 disabled:opacity-50 cursor-pointer"
                >
                {sending ? "發送中..." : "發送訊息"}
                </button>
            </div>
        </div>
    );
}
