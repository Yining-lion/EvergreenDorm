import * as functions from "firebase-functions/v2";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const notifyOnNewMessage = functions.firestore
  .onDocumentCreated("chatRooms/{roomId}/messages/{messageId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const message = snapshot.data();
    if (!message) return;

    const roomId = event.params.roomId;
    const roomDoc = await db.collection("chatRooms").doc(roomId).get();
    const roomData = roomDoc.data();
    if (!roomData) return;

    const senderId = message.senderId;
    const roomType = roomData.type;

    let recipientIds: string[] = [];

    try {
      if (roomType === "private") {
        // private 房間：通知 members 中的其他人 + 所有管理員
        if (!Array.isArray(roomData.members)) {
          console.warn(`Private room ${roomId} is missing members`);
          return;
        }
        
        // 取得 members 中的其他人
        const memberIds = roomData.members.filter((uid: string) => uid !== senderId);
        
        // 取得所有管理員（需要根據您的管理員判斷邏輯）
        const adminIds = await getAdminIds();
        
        // 合併並去重複（避免發送者是管理員時重複通知）
        recipientIds = [...new Set([...memberIds, ...adminIds])]
          .filter(uid => uid !== senderId);

      } else if (roomType === "global") {
        // global 房間：通知所有 members（除了發送者）
        const membersSnap = await db.collection("members").get();
        recipientIds = membersSnap.docs
          .map(doc => doc.id)
          .filter(uid => uid !== senderId);

      } else if (roomType === "BF") {
        // BF 房間：通知該樓層的雅房住戶 + 管理員
        const BF = roomData.BF;
        if (!BF) {
          console.warn(`BF room ${roomId} is missing BF field`);
          return;
        }

        // 找出該 BF 的雅房住戶
        const bfUsers = await getUsersByBF(BF);
        
        // 找出管理員
        const adminIds = await getAdminIds();

        // 合併並去除發送者
        recipientIds = [...new Set([...bfUsers, ...adminIds])]
          .filter(uid => uid !== senderId);

      } else {
        console.log(`Unknown room type: ${roomType} for room ${roomId}`);
        return;
      }

      if (recipientIds.length === 0) {
        console.log(`No recipients found for room ${roomId}`);
        return;
      }

      // 取得所有接收者的 FCM token
      const tokenPromises = recipientIds.map(async (uid: string) => {
        try {
          const memberDoc = await db.collection("members").doc(uid).get();
          const memberData = memberDoc.data();
          return memberData?.fcmToken || null;
        } catch (error) {
          console.error(`Error getting FCM token for member ${uid}:`, error);
          return null;
        }
      });

      const tokens = (await Promise.all(tokenPromises))
        .filter((token): token is string => Boolean(token));

      if (tokens.length === 0) {
        console.log(`No valid FCM tokens found for room ${roomId}`);
        return;
      }

      // 準備推播內容
      // 查詢 senderName
      let senderName = "某人";
      try {
        const senderDoc = await db.collection("members").doc(senderId).get();
        senderName = senderDoc.data()?.name || senderName;
      } catch (e) {
        console.warn("查詢 senderName 失敗:", e);
      }
      const body = `${senderName}：${message.content}` || "你有一則新訊息";

      // 建立一個 uid -> token 的對應表
      const uidTokenMap = new Map<string, string>();

      for (let i = 0; i < recipientIds.length; i++) {
        const uid = recipientIds[i];
        const memberDoc = await db.collection("members").doc(uid).get();
        const fcmToken = memberDoc.data()?.fcmToken;
        if (fcmToken) uidTokenMap.set(uid, fcmToken);
      }

      const adminIds = await getAdminIds();
      for (const [uid, token] of uidTokenMap.entries()) {
        const isAdmin = adminIds.includes(uid);
        const roomName = getRoomDisplayName(roomType, roomData.BF, isAdmin);
        const messagePayload = {
          token,
          data: {
            title: `長青宿舍 ${roomName} 聊天室有新訊息`,
            body,
            roomId,
            roomType,
            isAdmin: isAdmin ? "true" : "false",
          },
        };

        try {
          await admin.messaging().send(messagePayload);
          console.log(`Sent notification to ${uid}, isAdmin: ${isAdmin}`);
        } catch (err) {
          console.error(`Error sending to ${uid}`, err);
        }
      }

    } catch (error) {
      console.error(`Error processing notification for room ${roomId}:`, error);
    }
  });

// 輔助函式：取得管理員 ID 列表
async function getAdminIds(): Promise<string[]> {
  try {
    const adminIds: string[] = [];
    
    // 檢查所有 members 集合中的用戶的 custom claims
    const membersSnap = await db.collection("members").get();
    
    for (const memberDoc of membersSnap.docs) {
      try {
        const userRecord = await admin.auth().getUser(memberDoc.id);
        if (userRecord.customClaims?.admin === true) {
          adminIds.push(memberDoc.id);
        }
      } catch (error) {
        // 如果用戶不存在於 Auth 中，跳過
        console.warn(`User ${memberDoc.id} not found in Auth:`, error);
      }
    }
    
    return adminIds;
  } catch (error) {
    console.error("Error getting admin IDs:", error);
    return [];
  }
}

// 輔助函式：根據 BF 取得該樓層的雅房住戶
async function getUsersByBF(BF: string): Promise<string[]> {
  try {
    const building = BF.charAt(0); // "C1" -> "C"
    const floor = BF.slice(1); // "C1" -> "1"
    
    // 取得所有 members
    const membersSnap = await db.collection("members").get();
    const bfUsers: string[] = [];
    
    // 檢查每個 member 的房間類型
    for (const memberDoc of membersSnap.docs) {
      const memberData = memberDoc.data();
      const roomNumber = memberData.roomNumber;
      
      if (!roomNumber || typeof roomNumber !== 'string') continue;
      
      // 解析 roomNumber
      const memberBuilding = roomNumber.charAt(0);
      const memberFloor = roomNumber.charAt(1);
      const roomNo = roomNumber.slice(1);
      
      // 檢查是否同一棟同一樓
      if (memberBuilding === building && memberFloor === floor) {
        // 檢查是否為雅房（需要查詢 rooms 集合）
        const roomDocId = `${memberBuilding}-${memberFloor}-${roomNo}`;
        const roomDoc = await db.collection("rooms").doc(roomDocId).get();
        
        if (roomDoc.exists) {
          const roomData = roomDoc.data();
          // 如果不是套房，就是雅房
          if (roomData?.type !== "套房") {
            bfUsers.push(memberDoc.id);
          }
        }
      }
    }
    
    return bfUsers;
  } catch (error) {
    console.error(`Error getting users by BF ${BF}:`, error);
    return [];
  }
}

// 輔助函式：根據房間類型生成顯示名稱
function getRoomDisplayName(roomType: string, BF?: string, isAdmin?: boolean): string {
  switch (roomType) {
    case "global":
      return "全部";
    case "BF":
      return BF ? `${BF}雅房` : "雅房";
    case "private":
      return isAdmin ? "個人" : "管理員";
    default:
      return "聊天室";
  }
}