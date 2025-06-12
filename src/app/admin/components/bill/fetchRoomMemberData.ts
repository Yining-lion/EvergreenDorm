import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Room } from "@/app/admin/roomList/components/Rooms"

// room 的 roomNumber 形式是例如 "301"，所以需要 building 例如 "B"
export type WriteElecRow = { 
  roomNumber: string; 
  name_1: string | "";
  name_2: string | "";
  building: string;
}; 

// member 的 roomNumber 形式是例如 "B301";
type Member = { 
  name: string; 
  roomNumber: string; 
}; 

export type CaculateElecRow = { 
  roomNumber: string;
  name_1: string;
  name_2: string;
  voltage_110?: number;
  voltage_220?: number;
  pubBath: string;
  noPubBathPesrson?: string;
};

export async function fetchRoomRows(): Promise<{
  writeElecRows: WriteElecRow[];
  caculateElecRows: CaculateElecRow[];
}>{
  const roomSnap = await getDocs(collection(db, "rooms"));
  const memberSnap = await getDocs(collection(db, "members"));

  const rooms = roomSnap.docs.map(doc => doc.data() as Room);
  const members = memberSnap.docs.map(doc => doc.data() as Member);

  // 抄電錶用
  const writeElecRows: WriteElecRow[] = [];
  // 計算各房水電費用
  const caculateElecRows: CaculateElecRow[] = [];

  for (const room of rooms) {
    const peopleInRoom = members.filter(m => m.roomNumber === `${room.building}${room.roomNumber}`).map(m => m.name);

    // 為雅房指定公浴棟號
    let buildingNumber = ""; 
    if (room.type === "雅房") {
      buildingNumber = `${room.building}${room.floor}`;
    }

    writeElecRows.push({
      roomNumber: `${room.building}${room.roomNumber}`,
      name_1: peopleInRoom[0] || "",
      name_2: peopleInRoom[1] || "",
      building: room.building
    });

    caculateElecRows.push({
      roomNumber: `${room.building}${room.roomNumber}`,
      name_1: peopleInRoom[0] || "",
      name_2: peopleInRoom[1] || "",
      pubBath: buildingNumber || "",
    });
  }

  return {writeElecRows, caculateElecRows};
}
