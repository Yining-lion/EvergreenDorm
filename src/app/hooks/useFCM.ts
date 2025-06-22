// src/app/hooks/useFCM.ts
import { useEffect } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);

export function useFCM(userId?: string) {
  useEffect(() => {
    const setupMessaging = async () => {
      const supported = await isSupported();
      if (!supported || !userId) {
        console.log("瀏覽器不支援 FCM");
        return;
      }

      // 先註冊 Service Worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log("SW 註冊成功", registration);

      const messaging = getMessaging(app);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("使用者未授權通知");
        return;
      }

      // 使用已註冊的 SW 來取得 token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        console.log("取得 token：", token);
        await setDoc(doc(db, "members", userId), { fcmToken: token }, { merge: true });
      }

      // onMessage(messaging, (payload) => {
      //   console.log("收到通知：", payload);
      //   const { title, body } = payload.data!;
      //     new Notification(title, { body });
      // });
    };

    if (typeof window !== "undefined") {
      setupMessaging();
    }
  }, [userId]);
}