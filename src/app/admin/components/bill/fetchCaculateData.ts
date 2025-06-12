import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getTaiwanYearMonth } from "./getTaiwanYearMonth";

export async function fetchMonthlyElectricityData() {
    const currentId = getTaiwanYearMonth();
    const previousId = getTaiwanYearMonth(-1);

    const currentRoomSnap = await getDoc(doc(db, "roomsElec", currentId));
    const previousRoomSnap = await getDoc(doc(db, "roomsElec", previousId));
    const currentPubBathSnap = await getDoc(doc(db, "pubBathElec", currentId));
    const previousPubBathSnap = await getDoc(doc(db, "pubBathElec", previousId));

    if (!currentRoomSnap.exists() || !previousRoomSnap.exists()) {
        alert("找不到各房度數資料，請確認該月份電費是否已上傳");
        return;
    }

    if (!currentPubBathSnap.exists() || !previousPubBathSnap.exists()) {
        alert("找不到公浴度數資料，請確認該月份電費是否已上傳");
        return;
    }

    const currentRoomData = currentRoomSnap.data().data;
    const previousRoomData = previousRoomSnap.data().data;
    const currentPubBathData = currentPubBathSnap.data().data;
    const previousPubBathData = previousPubBathSnap.data().data;

    return { currentRoomData, previousRoomData, currentPubBathData, previousPubBathData };
}

export async function fetchBillBassData() {

    const billBaseSnap = await getDoc(doc(db, "billBase", "Wqy39ZbzvEZuEMViIAPj"));

    if (!billBaseSnap.exists()) {
        alert("找不到基本度數資料");
        return;
    }

    const  billBaseData = billBaseSnap.data();

    return billBaseData;
}