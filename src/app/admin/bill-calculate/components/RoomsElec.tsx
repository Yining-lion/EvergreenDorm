"use client";

import * as XLSX from "xlsx";
import { db } from "@/app/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

type RoomsElec =  {
    房號: string;
    姓名1: string | null;
    姓名2: string | null;
    電壓110: number | string;
    電壓220: number | string;
    公浴歸屬: string;
    不算公浴: string;
}

export default function RoomsElec() {
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = await file.arrayBuffer(); // 把檔案轉成二進位資料格式
        const workbook = XLSX.read(data); // 將檔案資料讀進來
        const sheet = workbook.Sheets[workbook.SheetNames[0]]; // 取得第一個工作表的名稱，並取出該工作表內容
        const jsonData: RoomsElec[] = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // { defval: "" } 表示若單元格是空的，會填入空字串，而不是 undefined

        // 資料格式轉為陣列
        const transformedData = jsonData.map((row) => {
            const raw110 = String(row["電壓110"]).trim();
            const raw220 = String(row["電壓220"]).trim();
            const voltage_110 = Number(raw110);
            const voltage_220 = Number(raw220);

            return {
                roomNumber: row["房號"],
                name_1: row["姓名1"],
                name_2: row["姓名2"],
                voltage_110,
                voltage_220,
                pubBath: row["公浴歸屬"],
                noPubBathPesrson: row["不算公浴"]
            };
        });

        try {
            // 文件 ID 為工作表名稱 ex: 11405
            await setDoc(doc(db, "roomsElec", workbook.SheetNames[0]), {
            data: transformedData,
            timestamp: serverTimestamp()
        });
            alert("上傳成功！");

        } catch(err) {
            alert(`上傳失敗，原因 ${err}`);
        }    
    };

    return (
        <label className="bg-white p-10 font-semibold text-gray cursor-pointer ml-10">
            2. 上傳各房度數
            <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                onChange={handleFileUpload}
            />
        </label>
    );
}
