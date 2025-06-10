import ExcelJS from 'exceljs';

export type Row = {
  building: string;
  roomNumber: string;
  name: string;
};

export default async function downloadExcel(rows: Row[]) {
  // 分離 B 棟和 C 棟資料
  const bRooms = rows.filter(r => r.building === 'B');
  const cRooms = rows.filter(r => r.building === 'C');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('電錶');

  // 標題列
  const headers = [
    "房號", "110電壓", "220電壓", "合計", "本月用電", "電費", "水費", "水電費",
    "房號", "110電壓", "220電壓", "合計", "本月用電", "電費", "水費", "水電費"
  ];
  worksheet.addRow(headers);

  // 找最大列數，確保所有資料都能放下
  const maxRows = Math.max(bRooms.length, cRooms.length);

  for (let i = 0; i < maxRows; i++) {
    const bRoom = bRooms[i];
    const cRoom = cRooms[i];

    const row = [
      cRoom?.roomNumber ?? "", "", "", "", "", "", "", "",
      bRoom?.roomNumber ?? "", "", "", "", "", "", "", ""
    ];
    worksheet.addRow(row);
  }

  // 加樣式：走訪每個儲存格，加邊框與字型
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell) => {
      cell.font = {
        name: 'Microsoft JhengHei',
        size: 10,
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

  // 將整個 Excel 檔案轉為二進位資料
  const buffer = await workbook.xlsx.writeBuffer();

  // 前端操作
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // 把 buffer 包成 Blob，讓瀏覽器可以識別
  const url = URL.createObjectURL(blob); // 產生一個臨時 URL
  const a = document.createElement('a');
  a.href = url;
  a.download = '抄電錶用.xlsx';
  a.click();
  URL.revokeObjectURL(url); // 釋放資源，避免記憶體洩漏
}
