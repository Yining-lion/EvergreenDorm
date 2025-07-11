"use client"

import { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "@/app/lib/firebase";
import { useAuth } from "@/app/auth/authContext";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import ChatInput from "@/app/components/Chat/ChatInput";
import ChatWindow from "@/app/components/Chat/ChatWindow";

type ChatRoomWithProfile = {
  id: string;
  name: string;
  type: "private";
  members: string[];
  hasUnread?: boolean;
  memberProfile: {
    uid: string;
    roomNumber: string;
    name: string;
    photoURL: string;
  };
};

export default function ChatAdminPrivate () {
    const { user, loading } = useAuth();
    const [roomsWithProfile, setRoomsWithProfile] = useState<ChatRoomWithProfile[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<string>("");
    const [search, setSearch] = useState("");
    const [isMobileView, setIsMobileView] = useState(false);
    const [showChat, setShowChat] = useState(false);

    // 取得聊天室清單 (admin 角色可取得所有房間)
    const { chatRooms, refresh } = useChatRooms(user?.uid ?? "", user?.role ?? "admin", "private");

    useEffect(() => {

        // cancelled 用來避免在組件卸載後還執行 setState() 而報錯
        let cancelled = false;

        const load = async () => {
            const list: ChatRoomWithProfile[] = [];

            for (const room of chatRooms) {
                // room.type 是 "private"時才有 room.members 陣列，且其中只有那一位會員
                if (room.type !== "private" || !room.members) continue;
                const memberUid = room.members[0];
                if (!memberUid) continue;

                const snap = await getDoc(doc(db, "members", memberUid));
                if (!snap.exists()) continue;

                const data = snap.data();
                list.push({
                ...(room as ChatRoomWithProfile),
                memberProfile: {
                    uid: memberUid,
                    roomNumber: data.roomNumber || "未知房號",
                    name: data.name || "未知姓名",
                    photoURL: data.photoURL || "/icons/member/Headshot.svg",
                },
                });
            }

            if (!cancelled) {
                setRoomsWithProfile(list);
                if (!activeRoomId && list[0]) {
                    setActiveRoomId(list[0].id);
                }
            }
        }

        load();

        return () => {cancelled = true;};
    }, [chatRooms, user]);

    useEffect(()=>{
        refresh();

        const handleResize = () => {
            setIsMobileView(window.innerWidth < 640);
        };

        handleResize(); // 初始化時先跑一次
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[])

    // useMemo 用來記憶計算結果
    const filtered = useMemo(() => {
        const kw = search.trim().toLowerCase();
        return roomsWithProfile.filter(({ memberProfile }) =>
            memberProfile.name.toLowerCase().includes(kw) ||
            memberProfile.roomNumber.toLowerCase().includes(kw)
        );
    }, [search, roomsWithProfile]);

    if (loading || !user) return <LoadingSpinner />;

    return (
        <div className="flex bg-white rounded-xs max-w-3xl mx-auto mt-10 h-[580px]">
            {/* 聊天清單 */}
            {(!isMobileView || !showChat) && (
                <div className="p-4 overflow-y-auto border-r border-primary-pink w-full sm:w-[30%]">
                    <input
                    type="text"
                    placeholder="輸入房號或姓名"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-4 p-2 bg-admin-gray focus:outline-0"
                    />

                    {filtered.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => {
                            setActiveRoomId(room.id);
                            if (isMobileView) setShowChat(true);
                        }}
                        className={`flex items-center w-full mb-2 p-2 hover:bg-gray-100 cursor-pointer ${
                        room.id === activeRoomId ? "bg-gray-200" : ""
                        }`}
                    >
                        <img
                        src={room.memberProfile.photoURL}
                        alt="avatar"
                        className="size-8 rounded-full mr-2"
                        />
                        <span className="text-gray">
                            {room.memberProfile.roomNumber} - {room.memberProfile.name}
                        </span>
                        {room.hasUnread && room.id !== activeRoomId && (
                        <span className="h-2 w-2 rounded-full bg-red-500 ml-2" />
                        )}
                    </button>
                    ))}
                </div>
            )}

            {/* 聊天區 */}
            {(activeRoomId && (!isMobileView || showChat)) && (
                <div className="flex-1 flex flex-col w-full sm:w-[70%]">
                    {isMobileView && (
                        <button 
                        className="text-primary-green px-4 py-2 text-left cursor-pointer" 
                        onClick={() => setShowChat(false)}
                        >
                        ← 返回
                        </button>
                    )}
                    <div className="flex-1 overflow-y-auto bg-white p-4 text-gray">
                        <ChatWindow roomId={activeRoomId} userId={user.uid} />
                    </div>
                    <div className="bg-white">
                        <ChatInput roomId={activeRoomId} userId={user.uid} storage={storage} />
                    </div>
                </div>
            )}
        </div>
    )
}