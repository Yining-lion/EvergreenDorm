"use client";

import { getDocs, collection} from "firebase/firestore";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/app/lib/firebase";

type Member = {
    uid: string,
    name: string,
    roomNumber: string,
};

export default function ParcelContent () {
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
            const fetchData = async () => {
                const membersSnapshot = await getDocs(collection(db, "members"))
                const fetchedData: Member[] = [];

                membersSnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedData.push({
                        uid: doc.id, 
                        name: data.name,
                        roomNumber: data.roomNumber || [],
                    });
                });

                setMembers(fetchedData);
            };
            fetchData();
        },[])

    // useMemo 用來記憶計算結果
        const filtered = useMemo(() => {
            const kw = search.trim().toLowerCase();
            return members.filter((member) =>
                member.name.toLowerCase().includes(kw) ||
                member.roomNumber.toLowerCase().includes(kw)
            );
        }, [search, members]);

    return (
        <div className="flex flex-col items-end">
            <input
            type="text"
            placeholder="輸入房號或姓名"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 p-2 bg-white focus:outline-0"
            />
            
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <thead>
                        <tr className="h-12">
                            <th>房號</th>
                            <th>姓名</th>
                            <th>通知</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((member) => {
                        
                            return (
                                <tr key={member.uid} className="h-12 hover:bg-green-50">
                                                                 
                                    <td className="border-t border-admin-gray">
                                        <p>{member.roomNumber}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{member.name}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <input type="checkbox"></input>
                                    </td>
                                    
                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
}