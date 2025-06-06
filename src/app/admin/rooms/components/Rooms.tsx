"use client";

import { getDocs, getDoc, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { v4 as uuidv4 } from "uuid";

type Room = {
  id: string;
  building: string;
  floor: number;
  roomNumber: string;
  type: string;
  person: string;
  rent: number;
};

type RoomStat = {
  category: string;
  type: string;
  person: string;
  count: number;
  rent: number[];
};

export default function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [allRents, setAllRents] = useState<number[]>([])

    const handleChange = (roomId:string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRooms((prevRooms) =>
            prevRooms.map((room) => {
                return room.id === roomId ? { ...room, [name]: value } : room;
            })
        );
    };

    const deleteRoom = async (roomId: string) => {
        const confirmDelete = confirm(`確定要刪除 ${roomId}？`);
        if (!confirmDelete) return;
        try {
            await deleteDoc(doc(db, "rooms", roomId));
            setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
        }
        catch(err) {
            console.error("刪除失敗:", err);
        }
    }

    const addRoom = () => {
        const newRoom: Room = {
            id: uuidv4(), // 暫時的 ID
            building: "B",
            floor: 1,
            roomNumber: "",
            type: "套房",
            person: "單人",
            rent: allRents[0],
        };
        setRooms((prevRooms) => [newRoom, ...prevRooms]);
        setEditingRowId(newRoom.id); // 直接開啟編輯模式
    };


    const updateRoom = async (roomId: string) => {
        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;

        const newId = `${room.building}-${room.floor}-${room.roomNumber}`;
        const docRef = doc(db, "rooms", newId)
        // 檢查 ID 是否已存在
        const existing = await getDoc(docRef);
        if (existing.exists()) {
        alert(`ID「${newId}」已存在，無法新增`);
        return;
        }
        await setDoc(docRef, {
            id: newId,
            building: room.building,
            floor: room.floor,
            roomNumber: room.roomNumber,
            type: room.type,
            person: room.person,
            rent: room.rent,
            updatedAt: new Date()
        });
          // 更新前端資料的 ID，移除原本 uuid 那筆
        setRooms((prevRooms) => [ ...prevRooms.filter((r) => r.id !== roomId), { ...room, id: newId }]);
        
        alert("更新成功！");
        setEditingRowId(null);
    }

    
    useEffect(() => {
        const fetchData = async () => {
            const roomsSnapshot = await getDocs(collection(db, "rooms"))
            const roomsdata = roomsSnapshot.docs.map((doc) => doc.data() as Room)
            setRooms(roomsdata);
            // 從 roomStats (房型統計) 取得所有租金，以便 rooms (房間清單) 租金的 option
            const roomStatsSnapshot = await getDocs(collection(db, "roomStats"))
            const roomStatsData = roomStatsSnapshot.docs.map((doc) => doc.data() as RoomStat)
            const allRents = roomStatsData.flatMap(data => data.rent)
            setAllRents(allRents)
        };
        fetchData();
    },[])

    return (
        <div className="flex flex-col items-end">
            <img 
            src="/icons/admin/Joyent.svg" 
            alt="add" 
            className="size-12 cursor-pointer mb-2 mr-5"
            onClick={addRoom}
            />
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <thead>
                        <tr className="h-12">
                            <th>id</th>
                            <th>棟名</th>
                            <th>樓層</th>
                            <th>房號</th>
                            <th>單雙人</th>
                            <th>房型</th>
                            <th>租金</th>
                            <th>刪改</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {rooms.map((room) => {
                            const isRowEditing = editingRowId === room.id;
                        
                            return (
                                <tr key={room.id} className="h-12 hover:bg-green-50">
                                    <td className="border-t border-admin-gray">{room.id}</td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<select 
                                            name="building"
                                            value={room.building}
                                            onChange={(e) => handleChange(room.id, e)}>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                        </select>):
                                        (room.building)}
                                    </td>                                
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<select 
                                            name="floor"
                                            value={room.floor}
                                            onChange={(e) => handleChange(room.id, e)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>):
                                        (room.floor)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input
                                            name="roomNumber"
                                            value={room.roomNumber}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(room.id, e)}
                                            required
                                        />):
                                        (room.roomNumber)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<select 
                                            name="person"
                                            value={room.person}
                                            onChange={(e) => handleChange(room.id, e)}>
                                            <option value="單人">單人</option>
                                            <option value="雙人">雙人</option>
                                        </select>):
                                        (room.person)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<select 
                                            name="type"
                                            value={room.type}
                                            onChange={(e) => handleChange(room.id, e)}>
                                            <option value="套房">套房</option>
                                            <option value="雅房">雅房</option>
                                        </select>):
                                        (room.type)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<select 
                                            name="rent"
                                            value={room.rent}
                                            onChange={(e) => handleChange(room.id, e)}>
                                            {allRents.map((rent, i) => (
                                                <option key={i} value={rent}>{rent}</option>
                                            ))}
                                        </select>):
                                        (room.rent)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<img 
                                            src="/icons/admin/Check.svg" 
                                            alt="check" 
                                            className="size-10 cursor-pointer mx-auto" 
                                            onClick={ async () => {
                                                await updateRoom(room.id);
                                                }}>
                                            </img>) :
                                        (<div className="flex justify-center items-center">
                                            <img src="/icons/admin/Edit.svg" alt="edit" className="size-7 cursor-pointer ml-2" onClick={() => setEditingRowId(room.id)}></img>
                                            <img src="/icons/admin/Delete.svg" alt="delete" className="size-7 cursor-pointer ml-2" onClick={() => deleteRoom(room.id)}></img>
                                        </div>)}
                                    </td>
                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 