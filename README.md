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
- 管理員功能支援完整 CRUD（如房型管理、會員管理、修改前台內容等）

## 🔹專案架構圖
```
[Client Side: Next.js App]
project-root
├── src/app
│   ├── activity
│   │   ├── components
│   │   │   └── ActivityContent.tsx
│   │   └── page.tsx 
│   ├── admin
│   │   ├── appoinment-notify
│   │   │   ├── components
│   │   │   │   └── AppoinmentNotify.tsx
│   │   │   └── page.tsx 
│   │   ├── appoinment-record
│   │   │   ├── components
│   │   │   │   └── AppoinmentRecord.tsx
│   │   │   └── page.tsx 
│   │   ├── bill-base
│   │   │   ├── components
│   │   │   │   ├── BillBaseContent.tsx
│   │   │   │   └── InitialExcelExportButton.tsx
│   │   │   └── page.tsx 
│   │   ├── bill-calculate
│   │   │   ├── components
│   │   │   │   ├── BillCalculateContent.tsx
│   │   │   │   ├── CaculateAndMessages.tsx
│   │   │   │   ├── CaculateExcelExportButton.tsx
│   │   │   │   ├── PublicBathsElec.tsx
│   │   │   │   └── RoomsElec.tsx
│   │   │   └── page.tsx 
│   │   ├── bill-notify
│   │   │   ├── components
│   │   │   │   └── BillNotifyContent.tsx
│   │   │   └── page.tsx 
│   │   ├── chat-all
│   │   │   ├── components
│   │   │   │   └── ChatAdmin.tsx
│   │   │   └── page.tsx 
│   │   ├── chat-private
│   │   │   ├── components
│   │   │   │   └── ChatAdminPrivate.tsx
│   │   │   └── page.tsx 
│   │   ├── components
│   │   │   ├── bill
│   │   │   │   ├── downloadCaculateElecExcel.tsx
│   │   │   │   ├── downloadInitialElecExcel.ts
│   │   │   │   ├── downloadTotalRateExcel.tsx
│   │   │   │   ├── fetchCaculateData.ts
│   │   │   │   ├── fetchRoomMemberData.ts
│   │   │   │   └── getTaiwanYearMonth.ts
│   │   │   ├── HeaderAdmin.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── frontend-activity
│   │   │   ├── [activityId]
│   │   │   │   ├── add
│   │   │   │   │   ├── AddActivityImagePage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit/[imageIndex]
│   │   │   │   │   ├── ActivityImageEditPage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── ActivityDetailPage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── add
│   │   │   │   ├── AddNewYearPage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   └── FrontendActivity.tsx
│   │   │   └── page.tsx 
│   │   ├── frontend-church
│   │   │   ├── aboutSister
│   │   │   │   ├── add
│   │   │   │   │   ├── AddSisterPage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit/[sisterId]
│   │   │   │   │   ├── EditSisterPage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── SisterDetailPage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── churchContent
│   │   │   │   ├── EditChurchContent.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   └── FrontendChurch.tsx
│   │   │   └── page.tsx 
│   │   ├── frontend-environment
│   │   │   ├── [facilityId]
│   │   │   │   ├── add
│   │   │   │   │   ├── AddFacilityImagePage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit/[imageIndex]
│   │   │   │   │   ├── FacilityImageEditPage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── FacilityDetailPage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   └── FrontendEnvironment.tsx
│   │   │   └── page.tsx 
│   │   ├── frontend-faq
│   │   │   ├── [faqId]
│   │   │   │   ├── add
│   │   │   │   │   ├── AddFaqPage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── edit/[questionIndex]
│   │   │   │   │   ├── EditQuestionPage.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── FaqDetailPage.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components
│   │   │   │   └── FrontendFAQ.tsx
│   │   │   └── page.tsx 
│   │   ├── member-info
│   │   │   ├── components
│   │   │   │   └── MemberInfo.tsx
│   │   │   └── page.tsx 
│   │   ├── member-verify
│   │   │   ├── components
│   │   │   │   └── MemberVerify.tsx
│   │   │   └── page.tsx 
│   │   ├── parcel
│   │   │   ├── components
│   │   │   │   └── ParcelContent.tsx
│   │   │   └── page.tsx 
│   │   ├── roomList
│   │   │   ├── components
│   │   │   │   └── Rooms.tsx
│   │   │   └── page.tsx 
│   │   ├── roomType
│   │   │   ├── components
│   │   │   │   └── RoomStats.tsx
│   │   │   └── page.tsx 
│   ├── appointment
│   │   ├── components
│   │   │   └── Guidelines.tsx
│   │   ├── form
│   │   │   ├── components
│   │   │   │   └── Form.tsx
│   │   │   └── page.tsx
│   │   ├── thankyou
│   │   │   ├── components
│   │   │   │   └── Thankyou.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx 
│   ├── auth
│   │   ├── AdminRoute.tsx
│   │   ├── authContext.tsx
│   │   └── ProtectedRoute.tsx
│   ├── church
│   │   ├── components
│   │   │   ├── AboutSister.tsx
│   │   │   ├── History&Vision.tsx
│   │   │   └── ChurchContent.tsx
│   │   └── page.tsx 
│   ├── components
│   │   ├── Activity
│   │   │   ├── ActivityModal.tsx
│   │   │   └── useFetchActivity.ts
│   │   ├── Chat
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatSelector.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   └── markAsRead.ts
│   │   ├── Church
│   │   │   ├── SisterCard.tsx
│   │   │   └── useFetchChurch.ts
│   │   ├── Evironnment
│   │   │   ├── FacilityCard.tsx
│   │   │   ├── FacilityModal.tsx
│   │   │   └── useFetchEnvironment.ts
│   │   ├── FAQ
│   │   │   └── useFetchFAQ.ts
│   │   ├── Buttons.tsx
│   │   ├── CatWrapper.tsx
│   │   ├── FadeInSection.tsx
│   │   ├── Footer.tsx
│   │   ├── HandleSignout.ts
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── MainBanner.tsx
│   │   ├── Modal.tsx
│   │   └── SectionLayout.tsx
│   ├── constants
│   │   └── navItems.tsx
│   ├── environment
│   │   ├── components
│   │   │   └── EnvironmentContent.tsx
│   │   └── page.tsx 
│   ├── faq
│   │   ├── components
│   │   │   ├── FAQ.tsx
│   │   │   └── FAQItem.tsx
│   │   └── page.tsx 
│   ├── hooks
│   │   ├── useChatRooms.ts
│   │   ├── useFCM.ts
│   │   └── useMessages.ts
│   ├── lib
│   │   ├── firebase.ts
│   │   └── handleImageChange.ts
│   ├── login
│   │   ├── components
│   │   │   └── CatLogin.tsx
│   │   └── page.tsx 
│   ├── member/
│   │   ├── chat
│   │   │   ├── components
│   │   │   │   └── Chat.tsx
│   │   │   └── page.tsx 
│   │   ├── components
│   │   │   ├── Profile.tsx
│   │   │   └── SubHeader.tsx
│   │   └── page.tsx 
│   ├── services
│   │   └── setupChatForNewUser.ts
│   ├── signup/
│   │   ├── components
│   │   │   └── CatSignup.tsx
│   │   └── page.tsx 
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── public
    ├── icons/
    ├── images/
    ├── favicon.ico
    └── firebase-messaging-sw.js

[Server Side: Firebase Functions]
project-root
└── functions
    ├── src
    │   └── index.ts
    ├── lib/
    ├── package.json
    └── tsconfig.json

[Data Scripts]
project-root
└── initializeData
    ├── images/
    ├── JSON/
    ├── setAdmin.ts
    └── upload.ts
```

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
