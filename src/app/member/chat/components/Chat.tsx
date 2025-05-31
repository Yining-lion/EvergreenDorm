"use client"

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { storage , db } from "@/app/lib/firebase";
import { useAuth } from "@/app/auth/authContext";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import ChatSelector from "@/app/components/Chat/ChatSelector";
import LoadingSpinner from "@/app/components/LoadingSpinner ";
import ChatInput from "@/app/components/Chat/ChatInput";
import ChatWindow from "@/app/components/Chat/ChatWindow";

export default function Chat () {
    const { user } = useAuth();

    const [activeRoomId, setActiveRoomId] = useState<string>("global");

    const [roomInfo, setRoomInfo] = useState<{
        BF: string | null; // BF 是 building + floor // ex: "C1"
        roomType: "shared" | "suite" | null;
    }>({ BF: null, roomType: null });
    const [roomLoading, setRoomLoading] = useState(true);

    // 呼叫 useChatRooms
    const { BF, roomType } = roomInfo;
    
    const chatRooms = useChatRooms(
        user?.uid ?? "",
        user?.role ?? "member", // member | admin
        undefined, // 略過 filterType
        BF ?? undefined, // C2 / C3 ... // 如果 BF 是 null，就傳 undefined，否則傳 BF
        roomType ?? undefined // shared / suite
    );

    // 拿到 user
    useEffect(() => {
        if (!user) return;

        const fetchRoom = async () => {
        // 從 user.roomNumber 解析出 building, floor, roomNo // ex: "C101" -> building="C", floor="1", roomNo="101"
        const rn = user.roomNumber as string;
        const building = rn.charAt(0); // "C"
        const floorNum = parseInt(rn.charAt(1), 10); // 1
        const roomNo = rn.slice(1); // "101"

        const roomDocId = `${building}-${floorNum}-${roomNo}`; // ex: "C-1-101"
        const roomRef = doc(db, "rooms", roomDocId);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
            const data = roomSnap.data() as {type: string; building: string ; floor: string;};
            setRoomInfo({
            BF: data.type === "套房" ? null : data.building + data.floor,
            roomType: data.type === "套房" ? "suite" : "shared",
            });
        } else {
            console.warn(`rooms/${roomDocId} 不存在`);
            setRoomInfo({ BF: null, roomType: null });
        }

        setRoomLoading(false);
        };

        fetchRoom();
    }, [user]);

    // 尚未登入或資料載入中，顯示 loading
    if (!user ||roomLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="bg-primary-pink">
            <div className="relative bg-white rounded-xs max-w-3xl mx-auto mt-10">
                {/* 聊天對象 */}
                <ChatSelector
                rooms={chatRooms}
                activeRoomId={activeRoomId}
                onSelectRoom={setActiveRoomId}
                />

                {/* 訊息框 */}
                <div className="flex-1 h-[400px]">
                    <div className="p-4 text-gray h-full">
                        <ChatWindow roomId={activeRoomId} userId={user.uid}/>
                    </div>
                </div>
                
                <ChatInput roomId={activeRoomId} userId={user.uid} storage={storage} />
                
            </div>
        </div>
        
    )
}