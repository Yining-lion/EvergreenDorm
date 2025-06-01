"use client";

import { getDocs, collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";

type Member = {
    uid: string,
    name: string,
    roomNumber: string,
    school: string,
    grade: string,
    phone: number,
    email: string,
    lastFiveDigits: number,
    contractExpiration: number,
};

export default function MemberInfo() {
    const [members, setMembers] = useState<Member[]>([]);
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [allRooms, setAllRooms] = useState<string[]>([]);

    const handleChange = (memberId:string, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMembers((prevMembers) =>
            prevMembers.map((member) => {
                return member.uid === memberId ? { ...member, [name]: value } : member;
            })
        );
    };

    const deleteMember = async (memberId: string, memberName: string) => {
        const confirmDelete = confirm(`確定要刪除 ${memberName} ？`);
        if (!confirmDelete) return;
        try {
            await deleteDoc(doc(db, "members", memberId));
            setMembers(prevMembers => prevMembers.filter(member => member.uid !== memberId));
        }
        catch(err) {
            console.error("刪除失敗:", err);
        }
    }

    const updateMember = async (memberId: string) => {
        const member = members.find((m) => m.uid === memberId);
        if (!member) return;

        const docRef = doc(db, "members", memberId)
  
        await setDoc(docRef, {
            name: member.name,
            roomNumber: member.roomNumber,
            school: member.school,
            grade: member.grade,
            phone: member.phone,
            email: member.email,
            lastFiveDigits: member.lastFiveDigits,
            contractExpiration: member.contractExpiration,
            updatedAt: new Date()
        });
        
        alert("更新成功！");
        setEditingRowId(null);
    }

    
    useEffect(() => {
        const fetchData = async () => {
            const membersSnapshot = await getDocs(collection(db, "members"))
            const membersData = membersSnapshot.docs.map((doc) => ({
                uid: doc.id, 
                ...(doc.data() as Omit<Member, "uid">)
            }))
            setMembers(membersData);
            
            // 從 rooms (房型清單) 取得所有棟名+房號，以便居住房號的 option
            const roomsSnapshot = await getDocs(collection(db, "rooms"))
            const roomsData = roomsSnapshot.docs.map((doc) => doc.data())
            const allRooms = roomsData.flatMap(data => data.building + data.roomNumber)
            setAllRooms(allRooms)
        };
        fetchData();
    },[])

    return (
        <div className="flex flex-col items-end">
            
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <thead>
                        <tr className="h-12">
                            <th>房號</th>
                            <th>姓名</th>
                            <th>信箱</th>
                            <th>電話</th>
                            <th>學校</th>
                            <th>年級</th>
                            <th>末五碼</th>
                            <th>合約到期日</th>
                            <th>刪改</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member) => {
                            const isRowEditing = editingRowId === member.uid;
                     
                            return (
                                <tr key={member.uid} className="h-12 hover:bg-green-50">
                                    
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<select 
                                            name="roomNumber"
                                            value={member.roomNumber}
                                            onChange={(e) => handleChange(member.uid, e)}>
                                                <option value="">請選擇</option>
                                                {allRooms.map(room => {
                                                    return (
                                                        <option key={room} value={room}>{room}</option>
                                                    )
                                            })}
                                        </select>):
                                        (member.roomNumber)}
                                    </td>                                
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            name="name"
                                            value={member.name}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.name)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input
                                            type="email"
                                            name="email"
                                            value={member.email}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.email)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            name="phone"
                                            value={member.phone}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.phone)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            name="school"
                                            value={member.school}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.school)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            name="grade"
                                            value={member.grade}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.grade)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            name="lastFiveDigits"
                                            value={member.lastFiveDigits}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.lastFiveDigits)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            type="date"
                                            name="contractExpiration"
                                            value={member.contractExpiration}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(member.uid, e)}
                                            required
                                        />):
                                        (member.contractExpiration)}
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<img 
                                            src="/icons/admin/Check.svg" 
                                            alt="check" 
                                            className="size-10 cursor-pointer mx-auto" 
                                            onClick={ async () => {
                                                await updateMember(member.uid);
                                                }}>
                                            </img>) :
                                        (<div className="flex justify-center items-center">
                                            <img src="/icons/admin/Edit.svg" alt="edit" className="size-7 cursor-pointer ml-2" onClick={() => setEditingRowId(member.uid)}></img>
                                            <img src="/icons/admin/Delete.svg" alt="delete" className="size-7 cursor-pointer ml-2" onClick={() => deleteMember(member.uid, member.name)}></img>
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