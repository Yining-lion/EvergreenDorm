import { doc, setDoc } from "firebase/firestore";
import { deleteToken, getMessaging } from "firebase/messaging";
import { db, auth } from "../lib/firebase";
import { signOut, User } from "firebase/auth";

const HandleSignout = async (user: User | null) =>  {
    if (typeof window !== "undefined" && user) {
        try {
            const messaging = getMessaging();
            // 刪除裝置上的 FCM token
            await deleteToken(messaging);
            // 更新 Firestore 將 token 清除
            await setDoc(doc(db, "members", user.uid), {
            fcmToken: null,
            }, { merge: true });
            console.log("FCM token 已刪除");
        } catch (err) {
            console.error("刪除 FCM token 發生錯誤", err);
        }
    }

    await signOut(auth);
}

export default HandleSignout;