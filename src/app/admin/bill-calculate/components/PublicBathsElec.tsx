"use client";

import * as XLSX from "xlsx";
import { db } from "@/app/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type PublicBathElec =  {
    棟號: string;
    人數: number | string;  // 初始還是字串，後面再轉數字
    電壓220: number | string;
}

export default function PublicBathsElec() {
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = await file.arrayBuffer(); // 把檔案轉成二進位資料格式
        const workbook = XLSX.read(data); // 將檔案資料讀進來
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // 取得第一個工作表的名稱，並取出該工作表內容
        const jsonData: PublicBathElec[] = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // { defval: "" } 表示若單元格是空的，會填入空字串，而不是 undefined
        /* ex: [
            { "棟號": "C1", "人數": 10, "電壓220": 100 },
            { "棟號": "C2", "人數": 15, "電壓220": 200 },
            { "棟號": "C3", "人數": 8,  "電壓220": 300 }
        ] */

        // 資料格式轉為陣列
        const transformedData = jsonData.map(row => ({
            building: row["棟號"],
            people: Number(row["人數"]),
            voltage_220: Number(row["電壓220"])
        }));

        try {
            // 文件 ID 為工作表名稱 ex: 11405
            await setDoc(doc(db, "pubBathElec", workbook.SheetNames[0]), {
            data: transformedData,
            timestamp: serverTimestamp()
        });
            alert("上傳成功！");

        } catch(err) {
            alert(`上傳失敗，原因 ${err}`);
        }
    };

    return (
        <label className="bg-white p-10 font-semibold text-gray cursor-pointer">
            1. 上傳公浴度數
            <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleFileUpload}
            />
        </label>
    );
}
