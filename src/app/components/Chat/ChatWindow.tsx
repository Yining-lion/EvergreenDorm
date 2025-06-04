"use client"

import { useRef, useEffect } from "react";
import { useMessages } from "@/app/hooks/useMessages";
import LoadingSpinner from "../LoadingSpinner";
import dayjs from "dayjs";

type messageProps = {
  roomId: string; 
  userId: string;
}

export default function ChatWindow({roomId, userId}: messageProps) {
  const { messages, loading } = useMessages(roomId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", inline: "nearest", });
  }, [messages]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="h-full px-4 py-2 overflow-y-auto">
      {messages.map((msg) => 
      {const displayTime = msg.createdAt?.toDate?.() ?? new Date(msg.localTimestamp);

        return (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex flex-col max-w-[70%]">
              {/* 姓名頭貼 */}
              {msg.senderId !== userId && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <img
                    src={msg.senderProfile?.avatar || "/icons/member/Headshot.svg"}
                    alt="avatar"
                    className="size-6 rounded-full"
                  />
                  <span>{msg.senderProfile?.name || "未知用戶"}</span>
                </div>
              )}

              {/* 訊息背景 */}
              <div
                className={`p-2 rounded-lg ${
                  msg.senderId === userId? "bg-primary-pink" : "bg-gray-50"
                }`}
              >
                {/* 圖片 */}
                {msg.attachments &&
                  msg.attachments.map((url) => (
                    <img key={url} src={url} className="max-h-40 mb-1 rounded" />
                ))}
                {/* 文字 */}
                <div>{msg.content}</div>
                {/* 時間 */}
                <div className="text-xs text-gray-400 text-right mt-2">
                  {dayjs(displayTime).format("YYYY/MM/DD HH:mm")}
                </div>
              </div>

            </div>
            
          </div>
        )
      }
      )}
      <div ref={bottomRef} />
    </div>
  );
}
