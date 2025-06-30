# 長青宿舍

## 🔗成果展示連結
https://evergreen-dorm.vercel.app/

## 🔹專案說明
長青宿舍分為三個族群以提供不同服務
- 一般民眾：瀏覽宿舍資訊、預約看房功能
- 會員(住宿者)：聊天室、接收水電費及包裹通知
- 管理員：房型管理、會員管理、聊天室、計算水電費並發送通知、發送包裹通知、修改前台內容、民眾預約通知

## 🔹技術特色
- 使用 React + Next.js + TypeScript + Tailwind CSS 建立前端，支援 RWD 響應式設計
- 使用 Node.js 撰寫腳本進行初始資料建置
- 使用 Firebase Authentication / Firestore / Cloud Messaging 實現登入驗證、資料儲存與通知推播
- 使用 `useContext` 建立全站共享的 Auth 狀態，並根據使用者角色（訪客 / 住宿者 / 管理員）進行權限控管與條件渲染
- 管理者功能支援完整 CRUD（如房型管理、會員管理、修改前台內容等）

## 🔹Demo
- 首頁
  ![image](https://github.com/Yining-lion/EvergreenDorm/blob/92ec595432897540d67cd35f5d3ddd7a3d1f7e28/README_IMG/%E9%A6%96%E9%A0%81.png)
- 登入頁面
  ![image](https://github.com/Yining-lion/EvergreenDorm/blob/92ec595432897540d67cd35f5d3ddd7a3d1f7e28/README_IMG/%E7%99%BB%E5%85%A5%E9%A0%81%E9%9D%A2.png)
- 會員個人檔案編輯
  ![image](https://github.com/Yining-lion/EvergreenDorm/blob/92ec595432897540d67cd35f5d3ddd7a3d1f7e28/README_IMG/%E6%9C%83%E5%93%A1%E5%80%8B%E4%BA%BA%E6%AA%94%E6%A1%88%E7%B7%A8%E8%BC%AF.png)
- 會員聊天室
  ![image](https://github.com/Yining-lion/EvergreenDorm/blob/92ec595432897540d67cd35f5d3ddd7a3d1f7e28/README_IMG/%E6%9C%83%E5%93%A1%E8%81%8A%E5%A4%A9%E5%AE%A4.png)
- 管理員
  ![image](https://github.com/Yining-lion/EvergreenDorm/blob/92ec595432897540d67cd35f5d3ddd7a3d1f7e28/README_IMG/%E7%AE%A1%E7%90%86%E5%93%A1.png)
