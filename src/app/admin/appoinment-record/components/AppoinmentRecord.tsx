"use client";

import { getDocs, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";

type AppoinmentRecords = {
    uid: string,
    name: string,
    grade: string,
    phone: number,
    email: string,
    moveInDate: number,
    roomType: string,
    visitTime: string,
    referrer?: string,
    record: boolean,
    recordedAt: Timestamp 
};

export default function AppoinmentRecord() {
    const [appoinmentRecords, setAppoinmentRecords] = useState<AppoinmentRecords[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const appoinmentsRecordsSnapshot = await getDocs(collection(db, "appoinmentsRecords"))
            const appoinmentsRecordsData = appoinmentsRecordsSnapshot.docs.map((doc) => 
                doc.data() as AppoinmentRecords
            )
            setAppoinmentRecords(appoinmentsRecordsData);
            
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
                            <th>紀錄時間</th>
                            <th>已到/未到</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appoinmentRecords.map((appoinmentRecord) => {
                            const recordedTime = appoinmentRecord.recordedAt.toDate();
                        
                            return (
                                <tr key={appoinmentRecord.uid} className="h-12 hover:bg-green-50">
                                    
                                                                 
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.name}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.grade}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.phone}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.email}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.moveInDate}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.roomType}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{dayjs(appoinmentRecord.visitTime).format("YYYY/MM/DD HH:mm")}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{appoinmentRecord.referrer}</p>
                                    </td>
                                    <td className="border-t border-admin-gray">
                                        <p>{dayjs(recordedTime).format("YYYY/MM/DD HH:mm")}</p>
                                    </td>
                                    
                                    <td className="border-t border-admin-gray">
                                        {appoinmentRecord.record ? 
                                        <p className="text-green-600">已到</p> :
                                        <p className="text-red-600">未到</p>}                                       
                                    </td>
                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 