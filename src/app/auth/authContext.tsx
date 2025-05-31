"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth"
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user: UserProfile | null;
  loading: boolean;
};

type UserProfile = {
  uid: string;
  email: string;
  role: "member" | "admin";
  [key: string]: unknown;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => { // Firebase 的 onAuthStateChanged() 方法會回傳一個函式，這個函式的用途是拿來取消這個監聽器
      if (firebaseUser) {
        const docRef = doc(db, "members", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        let role: "member" | "admin" = "member";
        // 檢查該使用者是否擁有 Firebase Auth 的 custom claims，這樣即使其沒有建立 members 資料夾也能正確辨識
        const tokenResult = await firebaseUser.getIdTokenResult();
        if (tokenResult.claims.admin) {
          role = "admin";
        }
        
        if (docSnap.exists()) {
          // 有寫入 members 者才可登入
          const data = docSnap.data();
          setUser({
            ...data, // firestore 的資料
            uid: firebaseUser.uid, // auth 資料的 id
            email: firebaseUser.email || data.email || "", // 若 auth 裡有就優先用
            role: role // member
          });
        } else if (role === "admin"){
            // 管理員即使沒寫入 members 也可登入
            setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role, // admin
          });
        } else {
          // 不是 admin 又沒有進 members，視為未審核，強制登出
          setUser(null);
          await signOut(auth);
          alert("帳號註冊成功，但尚未通過審核，請等待管理員批准後才能登入");
        }

      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // 元件卸載時清除監聽器
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}> {/* value={...} 是 Context 傳遞資料的唯一入口*/}
      {children}
    </AuthContext.Provider>
  ); // <AuthProvider> 用在 layout.tsx
}

export const useAuth = () => useContext(AuthContext);
