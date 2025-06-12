import ExcelJS from "exceljs";
import { CaculateElecRow } from "./fetchRoomMemberData";

export default async function downloadCaculateElecExcel(rows: CaculateElecRow[]) {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("電錶");

  // 標題列
  const headers = [
    "房號", "姓名1", "姓名2", "電壓110", "電壓220", "公浴歸屬", "不算公浴"
  ];
  worksheet.addRow(headers);

  rows.forEach((row) => {
    const r = [
      row.roomNumber ?? "",
      row.name_1 ?? "",
      row.name_2 ?? "",
      row.voltage_110 ?? "",
      row.voltage_220 ?? "",
      row.pubBath ?? "",
      row.noPubBathPesrson ?? ""
  ];
    worksheet.addRow(r);
  })

  // 加樣式：走訪每個儲存格，加邊框與字型
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.font = {
        name: 'Microsoft JhengHei',
        size: 12,
        bold: rowNumber === 1 // 標題列加粗
      };

      cell.border = {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' }
      };

      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
  });

  // 欄位統一寬度
  worksheet.columns.forEach(column => {
    column.width = 15;
  });

  // 將整個 Excel 檔案轉為二進位資料
  const buffer = await workbook.xlsx.writeBuffer();

  // 前端操作
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // 把 buffer 包成 Blob，讓瀏覽器可以識別
  const url = URL.createObjectURL(blob); // 產生一個臨時 URL
  const a = document.createElement('a');
  a.href = url;
  a.download = '計算各房度數.xlsx';
  a.click();
  URL.revokeObjectURL(url); // 釋放資源，避免記憶體洩漏
}
