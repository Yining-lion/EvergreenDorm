"use client"

import { useState, ChangeEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/app/lib/firebase";
import { FirebaseStorage } from "firebase/storage";
import { markRoomAsRead } from "./markAsRead";

interface ChatInputProps {
  roomId: string;
  userId: string;
  storage: FirebaseStorage;
}

export default function ChatInput({roomId, userId, storage}: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() && !file) return;
    setSending(true);

    const attachments: string[] = [];

    if (file) {
      const fileRef = ref(storage, `chat/${roomId}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      attachments.push(await getDownloadURL(fileRef));
    }

    await addDoc(collection(db, "chatRooms", roomId, "messages"), {
      senderId: userId,
      content: text.trim(),
      createdAt: serverTimestamp(),
      localTimestamp: Date.now(), // 暫時時間：本地產生，避免因 serverTimestamp() 非同步產生導致時間 undefined 而報錯
      attachments,
    });

    setText("");
    setFile(null);
    setPreviewUrl(null);
    markRoomAsRead(roomId, userId);
    setSending(false);
  };

  // 產生預覽圖 URL
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    // 檢查檔案類型
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
        alert("只能上傳 JPEG 或 PNG 圖片格式");
        return;
    }

    // 檢查檔案大小
    const MAX_SIZE_MB = 5;
    const isTooLarge = selectedFile.size > MAX_SIZE_MB * 1024 * 1024; // selectedFile.size 傳的是 Byte，所以要再 × 1,024 × 1,024
    if (isTooLarge) {
        alert(`圖片不能超過 ${MAX_SIZE_MB} MB`);
        return;
    }

    setPreviewUrl(URL.createObjectURL(selectedFile));
    setFile(selectedFile);

  };

  return (
    <div className="border-t border-primary-pink flex flex-col">

      {/* 預覽圖片 */}
      {previewUrl && (
        <div className="px-4 pt-4">
          <div className="relative inline-block">
            <img
              src="/icons/chat/Cancel.svg"
              className="absolute -right-3 -top-3 size-5 cursor-pointer z-10"
              onClick={() => {setPreviewUrl(null); setFile(null);}}
            />
            <img
              src={previewUrl}
              alt="預覽圖片"
              className="max-h-20 mb-2"
            />
          </div>
      </div>
      )}
      {/* 輸入框 */}
      <div className="px-4 py-2 h-30">
          <textarea
          placeholder="輸入訊息"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="placeholder-gray-400 outline-none w-full h-full text-gray resize-none"
          rows={3} // 預設顯示行數
          />
      </div>

      {/* 上傳圖片 + 傳送訊息 */}
      <div className="flex justify-between px-4 py-2">
          <label className="relative">
            <img src="/icons/chat/Plus.svg" className="size-6" alt="upload" />
            <input
              type="file"
              accept=".jpg, .jpeg, .png"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0"
          />
        </label>
          <button
            onClick={handleSend}
            disabled={sending}
            className="cursor-pointer"
          >
            <img src="/icons/chat/Sent.svg" className="size-6" alt="Sent"></img>
          </button>
      </div>
    </div>    
  );
}
