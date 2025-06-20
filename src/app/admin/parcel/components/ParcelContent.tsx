"use client";

import { getDocs, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/auth/authContext";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import LoadingSpinner from "@/app/components/LoadingSpinner";

type Member = {
    uid: string,
    name: string,
    roomNumber: string,
};

export default function ParcelContent () {
    const { user, loading } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
    const [text, setText] = useState<string>("有包裹哦！");
    const [sending, setSending] = useState(false);

    // 取得 private 聊天室清單 
    const { chatRooms } = useChatRooms(user?.uid ?? "", user?.role ?? "admin", "private");

    useEffect(() => {
            const fetchData = async () => {
                const q = query(collection(db, "members"), orderBy("roomNumber"));
                const membersSnapshot = await getDocs(q)
                const fetchedData: Member[] = [];

                membersSnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedData.push({
                        uid: doc.id, 
                        name: data.name,
                        roomNumber: data.roomNumber,
                    });
                });

                setMembers(fetchedData);
            };
            fetchData();
        },[])

    // 同步進行搜尋
    const filtered = useMemo(() => {
        const kw = search.trim().toLowerCase();
        return members.filter((member) =>
            member.name.toLowerCase().includes(kw) ||
            member.roomNumber.toLowerCase().includes(kw)
        );
    }, [search, members]);

    const handleCheckboxChange = (member: Member, checked: boolean) => {
        if (checked) {
            setSelectedMembers((prev) => [...prev, member]);
        } else {
            setSelectedMembers((prev) =>
                prev.filter((m) => m.uid !== member.uid)
            );
        }
    };

    const isSelected = (uid: string) => {
        return selectedMembers.some((m) => m.uid === uid);
    };

    // 同步更新預覽訊息內容
    const wholeMessages = useMemo(() => {
        return selectedMembers.map((member) => `${member.name}： ${text}`);
    }, [selectedMembers, text]);

    const handleSendMessage = async () => {
        if (!text) {
            alert("請輸入訊息內容");
            return;
        }

        if (selectedMembers.length === 0) {
            alert("請選擇要通知的對象");
            return;
        }

        setSending(true);
        
        try {

            for (const member of selectedMembers) {
                const room = chatRooms.find((r) => r.members?.[0] === member.uid);
                if (!room) continue;

                const message = `${member.name}： ${text}`;

                await addDoc(collection(db, "chatRooms", room.id, "messages"), {
                    senderId: user?.uid,
                    content: message,
                    createdAt: serverTimestamp(),
                    localTimestamp: Date.now(),
                });
                }

            alert("訊息已成功發送！");
            setSelectedMembers([]);
            
        } catch (err) {
            console.error("發送失敗：", err);
            alert("發送失敗，請稍後再試");

        } finally {
            setSending(false);
        }
    };

    if (loading || !user) return <LoadingSpinner/>;

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
            
            {/* 會員列表 */}
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <thead>
                        <tr className="h-12">
                            <th>房號</th>
                            <th>姓名</th>
                            <th>通知</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((member) => {
                            const selected = isSelected(member.uid);

                            return (
                                <tr 
                                key={member.uid} 
                                className="h-12 hover:bg-green-50 cursor-pointer"
                                onClick={() => handleCheckboxChange(member, !selected)}
                                >
                                                                 
                                    <td className="border-t border-admin-gray">
                                        <p>{member.roomNumber}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{member.name}</p>
                                    </td>
                                    <td 
                                    className="border-t border-admin-gray"
                                    onClick={(e) => e.stopPropagation()} // 避免點到 checkbox 同時觸發整列 onClick
                                    >
                                        <input 
                                        type="checkbox"
                                        checked={selected}
                                        onChange={(e) => {handleCheckboxChange(member, e.target.checked)}}
                                        className="size-5"
                                        ></input>
                                    </td>
                                    
                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            {/* 預覽及發送訊息區塊 */}
            <div className="mt-10 w-full bg-white p-4">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">群發訊息內容：</h2>
                <input
                className="w-full p-2 border border-gray-300 text-gray"
                placeholder="輸入要通知的訊息內容"
                value={text}
                onChange={(e) => setText(e.target.value)}
                />

                <h2 className="text-lg font-semibold my-2 mt-8 text-gray-800">預覽訊息內容：</h2>
                {selectedMembers.length > 0 ? (
                    <ol className="list-decimal pl-5 text-gray">
                        {wholeMessages.map((wholeMessage) => (
                            <li key={wholeMessage}>
                                {wholeMessage}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="text-gray">尚未選擇任何成員</p>
                )}

                <button
                    onClick={handleSendMessage}
                    disabled={sending}
                    className="bg-primary-green hover:bg-green-700 text-white px-6 py-2 mt-4 disabled:opacity-50 cursor-pointer"
                >
                    {sending ? "發送中..." : "發送訊息"}
                </button>
            </div>
        </div>
    );
}