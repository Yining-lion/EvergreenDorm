"use client"

import { useState } from "react";
import { storage } from "@/app/lib/firebase";
import { useAuth } from "@/app/auth/authContext";
import { useChatRooms } from "@/app/hooks/useChatRooms";
import ChatSelector from "@/app/components/Chat/ChatSelector";
import LoadingSpinner from "@/app/components/LoadingSpinner ";
import ChatInput from "@/app/components/Chat/ChatInput";
import ChatWindow from "@/app/components/Chat/ChatWindow";

export default function ChatAdmin () {
    const { user, loading } = useAuth();
    const [activeRoomId, setActiveRoomId] = useState<string>("global");

    // 取得聊天室清單（admin 角色可取得所有房間）
    const chatRooms = useChatRooms(user?.uid ?? "", user?.role ?? "admin", "system");

    if (loading || !user) return <LoadingSpinner />;

    return (
        <div className="">
            <div className="relative bg-white rounded-xs max-w-3xl mx-auto mt-10">
                {/* 聊天對象 */}
                <ChatSelector
                rooms={chatRooms}
                activeRoomId={activeRoomId}
                onSelectRoom={setActiveRoomId}
                />

                {/* 訊息框 */}
                <div className="flex-1 h-[400px]">
                    <div className="p-4 text-gray-500 h-full">
                        <ChatWindow roomId={activeRoomId} userId={user.uid}/>
                    </div>
                </div>
                
                <ChatInput roomId={activeRoomId} userId={user.uid} storage={storage} />
                
            </div>
        </div>
        
    )
}