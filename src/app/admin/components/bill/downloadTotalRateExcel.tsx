import ExcelJS from "exceljs";
import { Bill } from "../../bill-calculate/components/CaculateAndMessages";

export default async function downloadTotalRateExcel(rows: Bill[]) {

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("總表");

  // 標題列
  const headers = [
    "房號", "姓名", "電壓110", "電壓220", "電壓合計", "本月用電", "電費", "水費", "公浴", "水電公浴"
  ];
  worksheet.addRow(headers);

  // 按棟別分類
  const bRows = rows.filter(row => row.房號.startsWith("B"));
  const cRows = rows.filter(row => row.房號.startsWith("C"));

  // 寫入每棟資料 + 總計
  const writeBlock = (label: string, blockRows: Bill[]) => {
    let totalElec = 0;
    let totalWater = 0;
    let totalBath = 0;
    let totalAll = 0;

    blockRows.forEach(row => {
      worksheet.addRow([
        row.房號,
        row.姓名,
        row.電壓110,
        row.電壓220,
        row.電壓合計,
        row.本月用電,
        row.電費,
        row.水費,
        row.公浴,
        row.水電公浴
      ]);
      totalElec += row.電費;
      totalWater += row.水費;
      totalBath += row.公浴;
      totalAll += row.水電公浴;
    });

    // 插入該棟總計列
    worksheet.addRow([
      "", "", "", "", "", `${label}棟總計`,
      totalElec.toFixed(0),
      totalWater.toFixed(0),
      totalBath.toFixed(0),
      totalAll.toFixed(0)
    ]);

    return {
      電費: totalElec,
      水費: totalWater,
      公浴: totalBath,
      水電公浴: totalAll
    };
  };

  // 寫入 B 棟 & C 棟
  const bTotal = writeBlock("B", bRows);
  const cTotal = writeBlock("C", cRows);

  // 最後插入 BC 棟總計
  worksheet.addRow([
    "", "", "", "", "", "總計",
    (bTotal.電費 + cTotal.電費).toFixed(0),
    (bTotal.水費 + cTotal.水費).toFixed(0),
    (bTotal.公浴 + cTotal.公浴).toFixed(0),
    (bTotal.水電公浴 + cTotal.水電公浴).toFixed(0)
  ]);

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
    column.width = 12;
  });

  // 將整個 Excel 檔案轉為二進位資料
  const buffer = await workbook.xlsx.writeBuffer();

  // 前端操作
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // 把 buffer 包成 Blob，讓瀏覽器可以識別
  const url = URL.createObjectURL(blob); // 產生一個臨時 URL
  const a = document.createElement('a');
  a.href = url;
  a.download = '水電費總表.xlsx';
  a.click();
  URL.revokeObjectURL(url); // 釋放資源，避免記憶體洩漏
}
