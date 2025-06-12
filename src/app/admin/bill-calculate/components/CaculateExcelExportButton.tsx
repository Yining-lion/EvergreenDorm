"use client";
import { useState, useEffect } from "react";
import { CaculateElecRow, fetchRoomRows } from "../../components/bill/fetchRoomMemberData";
import downloadCaculateElecExcel from "../../components/bill/downloadCaculateElecExcel";

export default function CaculateExcelExportButton() {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<CaculateElecRow[]>([]);
    
    useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRoomRows();
      const { caculateElecRows } = data
      setRows(caculateElecRows as CaculateElecRow[]);
    };
    fetchData();
  }, []);

    const handleDownload = () => {
        setLoading(true);
        downloadCaculateElecExcel(rows as CaculateElecRow[]);
        setLoading(false);
    };

    return (
        <button
        className="w-[180px] py-2 bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
        onClick={handleDownload}
        disabled={loading}
        >
        {loading ? "下載中…" : "下載各房度數 Excel"}
        </button>
    );
}
