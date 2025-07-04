"use client";

import { getDocs, collection, doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";

export type RoomStat = {
  category: string;
  type: string;
  person: string;
  count: number;
  rent: number[];
  remaining: number;
};

export default function RoomStats() {
    const [roomStats, setRoomStats] = useState<RoomStat[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (index:number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRoomStats((prevStats) => {
            const newStats = [...prevStats];
            const updatedItem = {...newStats[index]}

            if (name === "person") {
                updatedItem.person = value;
            }

            if (name === "type") {
                updatedItem.type = value;
            }

            if (name === "count") {
                updatedItem.count = parseInt(value) || 0;
            }

            if (name === "rent") {
                // 將輸入的租金字串拆成陣列數字 (用 、 或 , 分隔)
                updatedItem.rent = value.split(/、|,/).map((v) => parseInt(v));
            }
            newStats[index] = updatedItem;
            return newStats;
        })
    };

    const updateRoomStats = async () => {
        for(const stat of roomStats) {
            const docRef = doc(db, "roomStats", stat.category)
            await updateDoc(docRef, { // updateDoc()只更新指定欄位，文件必須已存在；setDoc() 整份覆蓋，若文件不存在會新建
                category: stat.person + stat.type,
                type: stat.type,
                person: stat.person,
                count: stat.count,
                rent: stat.rent,
                remaining: stat.remaining,
                updatedAt: new Date()
            })
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const roomStatsSnapshot = await getDocs(collection(db, "roomStats"))
            const roomStatsData = roomStatsSnapshot.docs.map((doc) => doc.data() as RoomStat)
            setRoomStats(roomStatsData);
        };
        fetchData();
    },[])

    return (
        <div className="flex items-end">
            <div className="bg-white w-full overflow-x-auto">
                <table className="min-w-[700px] w-full text-gray-700 text-center">
                    <thead>
                        <tr className="h-12">
                            <th>單雙人</th>
                            <th>房型</th>
                            <th>間數</th>
                            <th>租金</th>
                            <th>剩餘房間數</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomStats.map((stat, index) => (
                            <tr key={stat.category} className="h-12">
                                <td className="border-t border-admin-gray">
                                    {isEditing ?
                                    (<select 
                                        name="person"
                                        value={stat.person}
                                        onChange={(e) => handleChange(index, e)}>
                                        <option value="單人">單人</option>
                                        <option value="雙人">雙人</option>
                                    </select>):
                                    (stat.person)}
                                </td>
                                <td className="border-t border-admin-gray">
                                    {isEditing ?
                                    (<select 
                                        name="type"
                                        value={stat.type}
                                        onChange={(e) => handleChange(index, e)}>
                                        <option value="套房">套房</option>
                                        <option value="雅房">雅房</option>
                                    </select>):
                                    (stat.type)}
                                </td>
                                <td className="border-t border-admin-gray">
                                    {isEditing ?
                                    (<input
                                        name="count"
                                        value={stat.count}
                                        className="bg-admin-gray text-center"
                                        onChange={(e) => handleChange(index, e)}
                                        required
                                    />):
                                    (stat.count)}
                                </td>                                
                                <td className="border-t border-admin-gray">
                                    {isEditing ?
                                    (<input 
                                        name="rent"
                                        value={stat.rent.join("、")} 
                                        className="bg-admin-gray text-center"
                                        onChange={(e) => handleChange(index, e)}
                                        required
                                        />):
                                    (stat.rent.join("、"))}
                                </td>
                                <td className="border-t border-admin-gray">
                                    {isEditing ?
                                    (<input
                                        name="remaining"
                                        value={stat.remaining}
                                        className="bg-admin-gray text-center"
                                        onChange={(e) => handleChange(index, e)}
                                        required
                                    />):
                                    (stat.remaining)}
                                </td> 
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isEditing ?
            (<img 
                src="/icons/admin/Check.svg" 
                alt="check" 
                className="size-10 cursor-pointer ml-2" 
                onClick={ async () => {
                    await updateRoomStats();
                    alert("更新成功！")
                    setIsEditing(false);
                    }}>
                </img>) :
            (<img src="/icons/admin/Edit.svg" alt="edit" className="size-10 cursor-pointer ml-2" onClick={() => setIsEditing(true)}></img>)}
        </div>
    );
} 