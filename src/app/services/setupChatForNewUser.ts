import { doc, setDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function setupChatForNewUser(userId: string) {
  // 建立 private 聊天室
  const privateRoomId = userId + "_admin";
  const privateRef = doc(db, "chatRooms", privateRoomId);
  await setDoc(privateRef, {
    name: "管理員",
    type: "private",
    members: [userId],
    createdAt: new Date(),
  });
}
