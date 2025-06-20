import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function markRoomAsRead(roomId: string, userId: string) {
  const readRef = doc(db, "chatRooms", roomId, "readStatus", userId);
  await setDoc(readRef, {
    lastRead: serverTimestamp(),
  }, { merge: true });
}
