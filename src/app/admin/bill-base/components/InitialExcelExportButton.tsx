"use client";
import { useState, useEffect } from "react";
import { fetchRoomRows, Room} from "../../components/bill/FetchData";
import downloadExcel, { Row } from "../../components/bill/initialElectricityMeterExcel";

export default function InitialExcelExportButton() {
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState<Row[] | Room[]>([]);
    
    useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRoomRows();
      setRooms(data as Room[]);
    };
    fetchData();
  }, []);

    const handleDownload = () => {
        setLoading(true);
        downloadExcel(rooms as Row[]);
        setLoading(false);
    };

    return (
        <button
        className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
        onClick={handleDownload}
        disabled={loading}
        >
        {loading ? "下載中…" : "下載抄電表用 Excel"}
        </button>
    );
}
