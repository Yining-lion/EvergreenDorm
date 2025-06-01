"use client";

import { getDocs, collection, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

type Appoinments = {
    uid: string,
    name: string,
    grade: string,
    phone: number,
    email: string,
    moveInDate: number,
    roomType: string,
    visitTime: string,
    referrer?: string,
    createdAt: Timestamp 
};

export default function AppoinmentNotify() {
    const [appoinments, setAppoinments] = useState<Appoinments[]>([]);

    const handleArrivedOrNot = async (appoinmentId: string, appoinmentName: string, record: boolean) => {
        const appoinment = appoinments.find((a) => a.uid === appoinmentId);
        if (!appoinment) return;

        const confirmDelete = confirm(`確定 ${appoinmentName} ${record ? "已到" : "未到"}？`);
        if (!confirmDelete) return;

        const docRef = doc(db, "appoinmentsRecords", appoinmentId)
  
        await setDoc(docRef, {
            ...appoinment,
            record: record,
            recordedAt: serverTimestamp()
        });

        // 記錄完後，從 appoinments 名單中移除
        await deleteDoc(doc(db, "appoinments", appoinmentId));
        setAppoinments(prevAppoinments => prevAppoinments.filter(appoinment => appoinment.uid !== appoinmentId));

        alert("紀錄成功！");
    }

    
    useEffect(() => {
        const fetchData = async () => {
            const appoinmentsSnapshot = await getDocs(collection(db, "appoinments"))
            const appoinmentsData = appoinmentsSnapshot.docs.map((doc) => ({
                uid: doc.id, 
                ...(doc.data() as Omit<Appoinments, "uid">)
            }))
            setAppoinments(appoinmentsData);
            
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
                            <th>學校系級</th>
                            <th>聯絡電話</th>
                            <th>聯絡信箱</th>
                            <th>期望入住日期</th>
                            <th>期望房型</th>
                            <th>預約看房時間</th>
                            <th>推薦人</th>
                            <th>送出時間</th>
                            <th>已到/未到</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appoinments.map((appoinment) => {
                            const createdTime = appoinment.createdAt.toDate();
                        
                            return (
                                <tr key={appoinment.uid} className="h-12 hover:bg-green-50">
                                    
                                                                 
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.name}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.grade}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.phone}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.email}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.moveInDate}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.roomType}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{dayjs(appoinment.visitTime).format("YYYY/MM/DD HH:mm")}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinment.referrer}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{dayjs(createdTime).format("YYYY/MM/DD HH:mm")}</p>
                                    </td>
                                    
                                    <td className="border-t border-admin-gray">                                       
                                        <div className="flex justify-center items-center">
                                            <img src="/icons/admin/Check.svg" alt="check" className="size-7 cursor-pointer ml-2" onClick={() => handleArrivedOrNot(appoinment.uid, appoinment.name, true)}></img>
                                            <img src="/icons/admin/Cancel.svg" alt="cancel" className="size-7 cursor-pointer ml-2" onClick={() => handleArrivedOrNot(appoinment.uid, appoinment.name, false)}></img>
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