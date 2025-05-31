import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as fs from "fs";
import * as path from "path";
import mime from "mime";

const serviceAccount = require(path.resolve(__dirname, "../initializeData/JSON/serviceAccountKey.json"));

// 初始化 Firebase 應用
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "dorm-3f905.firebasestorage.app",
});

const db = getFirestore();
const bucket = getStorage().bucket();

// JSON 和 images 資料夾的絕對路徑
const JSON_DIR = path.resolve(__dirname, "../initializeData/JSON"); 
const IMAGES_DIR = path.resolve(__dirname, "../initializeData/images");

async function uploadEnvironment(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json"); // 去除 .json 副檔名，取得純檔名，當作 Firestore 的 collection 名稱

  for (const block of data) {
    const { category, description, images } = block;
    const uploadedImages = [];

    for (const img of images) {
      const localImagePath = path.join(IMAGES_DIR, collectionName, category, img.file); // ex: yourPath/images/environment/B棟/B棟單人套房.JPG
      if (!fs.existsSync(localImagePath)) {
        console.warn(`找不到圖片: ${localImagePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(localImagePath); // 把圖片讀成 Buffer (二進位格式)，準備上傳
      const ext = path.extname(img.file); // 從檔案名稱中取得副檔名 ex: .jpg 或 .JPG
      const mimeType = mime.getType(ext.toLowerCase()) || "image/jpeg"; // mime.getType() 只能識別小寫
      const filename = img.file;
      const remotePath = `${collectionName}/${category}/${filename}`; // 組出遠端的儲存路徑 ex: environment/B棟/B棟單人套房.JPG

      const file = bucket.file(remotePath); // 建立一個 Firebase Storage 的檔案參考 (file 物件)
      await file.save(fileBuffer, { contentType: mimeType }); // 上傳圖片到 Firebase Storage

      // 為剛上傳到 Firebase Storage 的圖片產生一個可讀取的公開 URL，然後儲存到一個陣列中
      const [url] = await file.getSignedUrl({ // "簽名過"的 URL：內含 Firebase 簽名與驗證資訊，不需要登入 Firebase Auth 也能使用
        action: "read", // 可讀取
        expires: "2100-01-01", // 連結有效期限
      });

      uploadedImages.push({
        title: img.title,
        url,
      });

      console.log(`上傳成功: ${remotePath}`);
    }
    
    // 寫入至 Firestore
    await db.collection(collectionName).add({
      category,
      description,
      images: uploadedImages,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${category}`);
  }
}

async function uploadRoomStats(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json");

  for (const block of data) {
    const { category, type, person, count, rent } = block;
    
    // 寫入至 Firestore
    await db.collection(collectionName).doc(category).set({
      category,
      type,
      person,
      count,
      rent,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${category}`);
  }
}

async function uploadRooms(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json");

  for (const block of data) {
    const { id, building, floor, roomNumber, type, person, rent } = block;
    
    // 寫入至 Firestore
    await db.collection(collectionName).doc(id).set({
      id, building, floor, roomNumber, type, person, rent,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${id}`);
  }
}

async function uploadChatRooms(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json");

  for (const block of data) {
    const { id, ...rest } = block;
    
    // 寫入至 Firestore
    await db.collection(collectionName).doc(id).set({
      ...rest,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${id}`);
  }
}

async function uploadActivity(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json"); // 去除 .json 副檔名，取得純檔名，當作 Firestore 的 collection 名稱

  for (const block of data) {
    const { category, images } = block;
    const uploadedImages = [];

    for (const img of images) {
      const localImagePath = path.join(IMAGES_DIR, collectionName, category, img.file); // ex: yourPath/images/activity/2020年/20200630祝福聖母像.jpg
      if (!fs.existsSync(localImagePath)) {
        console.warn(`找不到圖片: ${localImagePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(localImagePath); // 把圖片讀成 Buffer (二進位格式)，準備上傳
      const ext = path.extname(img.file); // 從檔案名稱中取得副檔名 ex: .jpg 或 .JPG
      const mimeType = mime.getType(ext.toLowerCase()) || "image/jpeg"; // mime.getType() 只能識別小寫
      const filename = img.file;
      const remotePath = `${collectionName}/${category}/${filename}`; // 組出遠端的儲存路徑 ex: environment/B棟/B棟單人套房.JPG

      const file = bucket.file(remotePath); // 建立一個 Firebase Storage 的檔案參考 (file 物件)
      await file.save(fileBuffer, { contentType: mimeType }); // 上傳圖片到 Firebase Storage

      // 為剛上傳到 Firebase Storage 的圖片產生一個可讀取的公開 URL，然後儲存到一個陣列中
      const [url] = await file.getSignedUrl({ // "簽名過"的 URL：內含 Firebase 簽名與驗證資訊，不需要登入 Firebase Auth 也能使用
        action: "read", // 可讀取
        expires: "2100-01-01", // 連結有效期限
      });

      uploadedImages.push({
        title: img.title,
        url,
      });

      console.log(`上傳成功: ${remotePath}`);
    }
    
    // 寫入至 Firestore
    await db.collection(collectionName).add({
      category,
      images: uploadedImages,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${category}`);
  }
}

async function uploadAboutSister(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json"); // 去除 .json 副檔名，取得純檔名，當作 Firestore 的 collection 名稱

  for (const block of data) {
    const { category, description, images } = block;
    const uploadedImages = [];

    for (const img of images) {
      const localImagePath = path.join(IMAGES_DIR, collectionName, img.file); // ex: yourPath/images/aboutSister/修女預覽圖.JPG
      if (!fs.existsSync(localImagePath)) {
        console.warn(`找不到圖片: ${localImagePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(localImagePath); // 把圖片讀成 Buffer (二進位格式)，準備上傳
      const ext = path.extname(img.file); // 從檔案名稱中取得副檔名 ex: .jpg 或 .JPG
      const mimeType = mime.getType(ext.toLowerCase()) || "image/jpeg"; // mime.getType() 只能識別小寫
      const filename = img.file;
      const remotePath = `${collectionName}/${filename}`; // 組出遠端的儲存路徑 ex: aboutSister/修女預覽圖.JPG

      const file = bucket.file(remotePath); // 建立一個 Firebase Storage 的檔案參考 (file 物件)
      await file.save(fileBuffer, { contentType: mimeType }); // 上傳圖片到 Firebase Storage

      // 為剛上傳到 Firebase Storage 的圖片產生一個可讀取的公開 URL，然後儲存到一個陣列中
      const [url] = await file.getSignedUrl({ // "簽名過"的 URL：內含 Firebase 簽名與驗證資訊，不需要登入 Firebase Auth 也能使用
        action: "read", // 可讀取
        expires: "2100-01-01", // 連結有效期限
      });

      uploadedImages.push({
        url,
      });

      console.log(`上傳成功: ${remotePath}`);
    }
    
    // 寫入至 Firestore
    await db.collection(collectionName).add({
      category,
      description,
      photoURL: uploadedImages[0],
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${category}`);
  }
}

async function uploadChurchContent(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json");

  for (const block of data) {
    const { title, description } = block;
    
    // 寫入至 Firestore
    await db.collection(collectionName).add({
      title,
      description,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${title}`);
  }
}

async function uploadFAQ(data: any[], jsonFileName: string) {

  const collectionName = path.basename(jsonFileName, ".json");

  for (const block of data) {
    const { category, descriptions } = block;
    
    // 寫入至 Firestore
    await db.collection(collectionName).add({
      category,
      descriptions,
      createdAt: new Date(),
    });

    console.log(`寫入 Firestore: ${collectionName}/${category}`);
  }
}

async function uploadJsonWithType(jsonFileName: string) {
  const jsonFilePath = path.join(JSON_DIR, jsonFileName); // 將 JSON 裡的 json 檔結合成完整的檔案路徑 ex: yourPath/JSON/environmentData.json
  const content = fs.readFileSync(jsonFilePath, "utf-8"); // 讀取 json 檔案的純文字內容
  const parsed = JSON.parse(content);

  const { type, data } = parsed;

  switch (type) {
    case "faq":
      await uploadFAQ(data, jsonFileName);
      break;
    default:
      console.warn(`不支援的 type: ${type}（檔案: ${jsonFileName}）`);
  }
}

async function uploadAllJson() {
  const files = fs.readdirSync(JSON_DIR).filter(f => f.endsWith(".json") && f !== "serviceAccountKey.json");

  for (const file of files) {
    console.log(`處理檔案：${file}`);
    try {
      await uploadJsonWithType(file);
    } catch (err) {
      console.error(`錯誤處理 ${file}：`, err);
    }
  }

  console.log("所有 JSON 處理完成！");
}

uploadAllJson();