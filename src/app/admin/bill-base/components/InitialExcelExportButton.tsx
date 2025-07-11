"use client";
import { useState, useEffect } from "react";
import { fetchRoomRows, WriteElecRow} from "../../components/bill/fetchRoomMemberData";
import downloadInitialElecExcel from "../../components/bill/downloadInitialElecExcel";

export default function InitialExcelExportButton() {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<WriteElecRow[]>([]);
    
    useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRoomRows();
      const { writeElecRows } = data
      setRows(writeElecRows as WriteElecRow[]);
    };
    fetchData();
  }, []);

    const handleDownload = () => {
        setLoading(true);
        downloadInitialElecExcel(rows as WriteElecRow[]);
        setLoading(false);
    };

    return (
        <button
        className="w-[180px] py-2 bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
        onClick={handleDownload}
        disabled={loading}
        >
        {loading ? "下載中…" : "下載抄電表用 Excel"}
        </button>
    );
}
