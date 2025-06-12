"use client";

import { db } from "@/app/lib/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { fetchBillBassData, fetchMonthlyElectricityData } from "../../components/bill/fetchCaculateData";
import downloadTotalRateExcel from "../../components/bill/downloadTotalRateExcel";
import { getTaiwanYearMonth } from "../../components/bill/getTaiwanYearMonth";

export type Bill =  {
    房號: string;
    姓名: string | null;
    電壓110: number | string;
    電壓220: number | string;
    電壓合計: number;
    本月用電: number;
    電費: number;
    水費: number;
    公浴: number;
    水電公浴: number;
    預覽訊息: string;
}

type PubBathData = {
    building: string;
    voltage_220: number | string;
    people: number;
};

type RoomData = {
    roomNumber: string;
    voltage_110: number | string;
    voltage_220: number | string;
    name_1?: string;
    name_2?: string;
    pubBath: string;
};

export default function CaculateAndMessages() {
    const handleCaculate = async () => {
    try {
        const result = await fetchMonthlyElectricityData();
        if (!result) return;
        const { currentRoomData, previousRoomData, currentPubBathData, previousPubBathData } = result;

        const billBaseData = await fetchBillBassData();
        if (!billBaseData) return;

        // 處理公浴電費
        const pubBathMap: Record<string, number> = {};
        currentPubBathData.forEach((current: PubBathData) => {
            const prev = previousPubBathData.find((p: PubBathData) => p.building === current.building);
            if (!prev) return;

            // 本月用電數
            const usage220 = Number(current.voltage_220) - Number(prev.voltage_220);

            // 基本費率
            const isB = current.building.startsWith("B");
            const rate = isB ? billBaseData["B-rate"] : billBaseData["C-rate"]; // ex: 5.5

            // 每人分攤的公浴費
            const pubBathRate = usage220 * rate / current.people;
            const key = `${current.building}`; 
            pubBathMap[key] = pubBathRate; // ex: {"C2": 120, "C3": 140, ...}
        })

        const results: Bill[] = [];
        currentRoomData.forEach((current: RoomData) => {
            const prev = previousRoomData.find((p: RoomData) => p.roomNumber === current.roomNumber);
            if (!prev) return;

            // 抓出兩位房客的姓名 (name_1 和 name_2)，並過濾掉 Falsy 值，保證 names 是一個只包含「有效姓名」的陣列
            const names = [current.name_1, current.name_2].filter(Boolean) as string[];
            // 計算該房間有幾個住戶
            const shareCount = names.length || 1;
            // 查找該樓層的公浴費用
            const pubBathFee = pubBathMap[current.pubBath] || 0;

            // 本月用電數
            const usage110 = Number(current.voltage_110) - Number(prev.voltage_110);
            const usage220 = Number(current.voltage_220) - Number(prev.voltage_220);
            const totalUsage = usage110 + usage220;

            // 基本費率
            const isB = current.roomNumber.startsWith("B");
            const rate = isB ? billBaseData["B-rate"] : billBaseData["C-rate"]; // ex: 5.5
            const base = billBaseData["base-rate"]; // ex: 200
            const water = billBaseData["water-rate"]; // ex: 60

            // 每房間電費
            const elecFee = totalUsage * rate;
            // 若每人本月電費不超過基本費，以基本費計算
            const finalElec = (elecFee / shareCount) < base ? base : (elecFee / shareCount);

            const total = finalElec + water + pubBathFee;

            names.forEach((name: string) => {
                results.push({
                    房號: current.roomNumber,
                    姓名: name,
                    電壓110: Number(current.voltage_110),
                    電壓220: Number(current.voltage_220),
                    電壓合計: Number(current.voltage_110) + Number(current.voltage_220),
                    本月用電: totalUsage / shareCount,
                    電費: finalElec,
                    水費: water,
                    公浴: pubBathFee,
                    水電公浴: total,
                    預覽訊息: `${name}：本月電費${finalElec}、水費${water}、公浴${pubBathFee}、共計${total}元哦！`
                });
            });
        });

        downloadTotalRateExcel(results);

        // 取得年月作為 document ID ex: 11406
        const docId = getTaiwanYearMonth();

        // 準備要寫入的資料陣列
        const messageData = results.map(row => ({
            roomNumber: row.房號,
            name: row.姓名,
            message: row.預覽訊息
        }));

        // 寫入至 Firestore
        await setDoc(doc(db, "messagePreview", docId), {
            createdAt: serverTimestamp(),
            messages: messageData
        });

    } catch (err) {
        alert(`發生錯誤：${(err as Error).message}`);
    }
};

    return (
        <button 
        className="bg-white p-10 font-semibold text-gray cursor-pointer ml-10"
        onClick={handleCaculate}
        >
            3. 計算並下載水電費總表
        </button>
    );
}
