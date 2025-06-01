"use client";

import { getDocs, collection, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { setupChatForNewUser } from "@/app/services/setupChatForNewUser";

type PendingUsers = {
    uid: string,
    name: string,
    email: string,
};

export default function MemberVerify() {
    const [pendingUsers, setPendingUsers] = useState<PendingUsers[]>([]);

    const deletePendingUser = async (pendingUsersId: string, pendingUsersName: string) => {
        const confirmDelete = confirm(`確定要將 ${pendingUsersName} 從審核名單中刪除？`);
        if (!confirmDelete) return;
        try {
            await deleteDoc(doc(db, "pending_users", pendingUsersId));
            setPendingUsers(prevPendingUsers => prevPendingUsers.filter(pendingUser => pendingUser.uid !== pendingUsersId));
        }
        catch(err) {
            console.error("刪除失敗:", err);
        }
    }

    const updateToMember = async (pendingUsersId: string, pendingUsersName: string) => {
        const pendingUser = pendingUsers.find((user) => user.uid === pendingUsersId);
        if (!pendingUser) return;

        const confirmDelete = confirm(`確定要將 ${pendingUsersName} 加入會員？`);
        if (!confirmDelete) return;

        const docRef = doc(db, "members", pendingUsersId)
  
        await setDoc(docRef, {
            name: pendingUser.name,
            roomNumber: "",
            school: "",
            grade: "",
            phone: "",
            email: pendingUser.email,
            lastFiveDigits: "",
            contractExpiration: "",
            updatedAt: serverTimestamp()
        });

        // 成為會員後，從 pending_users 名單中移除
        await deleteDoc(doc(db, "pending_users", pendingUsersId));
        setPendingUsers(prevPendingUsers => prevPendingUsers.filter(pendingUser => pendingUser.uid !== pendingUsersId));

        // 成為會員後，建立跟管理員的聊天室
        setupChatForNewUser(pendingUsersId)
        
        alert("加入成功！");
    }

    
    useEffect(() => {
        const fetchData = async () => {
            const pendingUsersSnapshot = await getDocs(collection(db, "pending_users"))
            const pendingUsersData = pendingUsersSnapshot.docs.map((doc) => ({
                uid: doc.id, 
                ...(doc.data() as Omit<PendingUsers, "uid">)
            }))
            setPendingUsers(pendingUsersData);
            
        };
        fetchData();
    },[])

    return (
        <div className="flex flex-col items-end">
            
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <thead>
                        <tr className="h-12">
                            <th>姓名</th>
                            <th>信箱</th>
                            <th>審核</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map((pendingUser) => {
                        
                            return (
                                <tr key={pendingUser.uid} className="h-12 hover:bg-green-50">
                                    
                                                                 
                                    <td className="border-t border-admin-gray">
                                        <p>{pendingUser.name}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{pendingUser.email}</p>
                                    </td>
                                    
                                    <td className="border-t border-admin-gray">                                       
                                        <div className="flex justify-center items-center">
                                            <img src="/icons/admin/Check.svg" alt="check" className="size-7 cursor-pointer ml-2" onClick={() => updateToMember(pendingUser.uid, pendingUser.name)}></img>
                                            <img src="/icons/admin/Cancel.svg" alt="cancel" className="size-7 cursor-pointer ml-2" onClick={() => deletePendingUser(pendingUser.uid, pendingUser.name)}></img>
                                        </div>
                                    </td>
                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 