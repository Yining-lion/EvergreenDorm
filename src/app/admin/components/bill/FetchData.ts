import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export type Room = { building: string; roomNumber: string; }; // room 的 roomNumber 形式是例如 "301"，所以需要 building 例如 "B"
type Member = { name: string; roomNumber: string; }; // member 的 roomNumber 形式是例如 "B301";

export async function fetchRoomRows(): Promise<Room[]> {
  const roomSnap = await getDocs(collection(db, "rooms"));
  const memberSnap = await getDocs(collection(db, "members"));

  const rooms = roomSnap.docs.map(doc => doc.data() as Room);
  const members = memberSnap.docs.map(doc => doc.data() as Member);

  const rows: Room[] = [];

  for (const room of rooms) {
    const peopleInRoom = members.filter(m => m.roomNumber === `${room.building}${room.roomNumber}`).map(m => m.name);
    const combinedNames = peopleInRoom.join("");

    rows.push({
      roomNumber: `${room.building}${room.roomNumber}${combinedNames}`,
      building: room.building
    });
  }

  return rows;
}
