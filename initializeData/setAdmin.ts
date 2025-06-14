import admin from "firebase-admin";
import * as path from "path";

const serviceAccount = require(path.resolve(__dirname, "../initializeData/JSON/serviceAccountKey.json"));

// 初始化 Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// 給某個使用者設為 admin
const setAdmin = async (uid: string) => {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log("已成功將使用者設為管理員");
};

setAdmin("g3cPUhHk0fWVgAmv3mZGg4I2HMn1");