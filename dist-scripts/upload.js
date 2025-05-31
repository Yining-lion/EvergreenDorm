"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mime_1 = __importDefault(require("mime"));
const serviceAccount = require(path.resolve(__dirname, "../initializeData/JSON/serviceAccountKey.json"));
// 初始化 Firebase 應用
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
    storageBucket: "dorm-3f905.firebasestorage.app",
});
const db = (0, firestore_1.getFirestore)();
const bucket = (0, storage_1.getStorage)().bucket();
// JSON 和 images 資料夾的絕對路徑
const JSON_DIR = path.resolve(__dirname, "../initializeData/JSON");
const IMAGES_DIR = path.resolve(__dirname, "../initializeData/images");
async function uploadEnvironment(data, jsonFileName) {
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
            const mimeType = mime_1.default.getType(ext.toLowerCase()) || "image/jpeg"; // mime.getType() 只能識別小寫
            const filename = img.file;
            const remotePath = `${collectionName}/${category}/${filename}`; // 組出遠端的儲存路徑 ex: environment/B棟/B棟單人套房.JPG
            const file = bucket.file(remotePath); // 建立一個 Firebase Storage 的檔案參考 (file 物件)
            await file.save(fileBuffer, { contentType: mimeType }); // 上傳圖片到 Firebase Storage
            // 為剛上傳到 Firebase Storage 的圖片產生一個可讀取的公開 URL，然後儲存到一個陣列中
            const [url] = await file.getSignedUrl({
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
        console.log(`📝 寫入 Firestore: ${collectionName}/${category}`);
    }
}
async function uploadJsonWithType(jsonFileName) {
    const jsonFilePath = path.join(JSON_DIR, jsonFileName); // 將 JSON 裡的 json 檔結合成完整的檔案路徑 ex: yourPath/JSON/environmentData.json
    const content = fs.readFileSync(jsonFilePath, "utf-8"); // 讀取 json 檔案的純文字內容
    const parsed = JSON.parse(content);
    const { type, data } = parsed;
    switch (type) {
        case "environment":
            await uploadEnvironment(data, jsonFileName);
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
        }
        catch (err) {
            console.error(`錯誤處理 ${file}：`, err);
        }
    }
    console.log("所有 JSON 處理完成！");
}
uploadAllJson();
