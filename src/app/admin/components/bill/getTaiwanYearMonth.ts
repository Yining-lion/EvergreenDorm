export function getTaiwanYearMonth(offset: number = 0): string {
  const today = new Date();
  today.setMonth(today.getMonth() + offset); // 可加負數表示前幾個月

  const rocYear = today.getFullYear() - 1911;
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // 月份要補0
  
  return `${rocYear}${month}`; // ex：11406
}