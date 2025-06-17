"use client";

import { useState } from "react";
import CatWrapper from "@/app/components/CatWrapper"
import Link from "next/link"
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "@/app/lib/firebase";
import { db } from "@/app/lib/firebase";

const errorMessages: { [key: string]: string } = {
  "auth/invalid-email": "無效的電子郵件格式",
  "auth/email-already-in-use": "此電子郵件已被註冊過",
  "auth/weak-password": "密碼需要至少 6 個字元",
  "auth/internal-error": "系統錯誤，請稍後再試",
};

export default function CatSignup () {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // 註冊成功後，進入 pending_users 資料庫，等待管理員審核
            await setDoc(doc(db, "pending_users", user.uid), {
                    email,
                    name,
                    createdAt: serverTimestamp(), 
                });

            await signOut(auth);
            setMessage("註冊成功！");
            setIsError(false)
        } catch (err) {
            if (err && typeof err === "object" && "code" in err && "message" in err) {
                const firebaseError = err as { code: string; message: string };
                const errorCode = firebaseError.code;
                const errorMessage = errorMessages[errorCode] || "註冊失敗，請再試一次";
                setMessage(errorMessage);
                setIsError(true)
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <CatWrapper>
            <form onSubmit={handleSignup} className="relative w-[250px] m-auto flex flex-col items-center">
                <h2 className="text-center text-2xl font-bold mb-4">註冊會員</h2>

                <div className="flex items-center w-full mb-2 bg-primary-orange p-2">
                    <img src="/icons/login/Name.svg" alt="name" className="size-5 mr-2"></img>
                    <input 
                    type="text" 
                    placeholder="姓名" 
                    className="focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>
                <div className="flex items-center w-full mb-2 bg-primary-orange p-2">
                    <img src="/icons/login/Email.svg" alt="email" className="size-5 mr-2"></img>
                    <input 
                    type="email" 
                    placeholder="電子信箱" 
                    className="focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="flex items-center w-full mb-2 bg-primary-orange p-2">
                    <img src="/icons/login/Lock.svg" alt="password" className="size-5 mr-2"></img>
                    <input 
                    type="password" 
                    placeholder="密碼" 
                    className="focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                {message && (
                    <p
                        className={`absolute bottom-19 text-sm ${
                        isError ? "text-red-600" : "text-primary-green"
                        }`}
                    >
                        {message}
                    </p>
                )}

                { isLoading ? 
                <div className="w-[150px] bg-[#FF8C62] py-2 font-semibold mt-6 flex justify-center">
                    <div className="w-6 h-6 border-3 border-white border-t-[#FF8C62] rounded-full animate-spin"></div>
                </div>:
                <button type="submit" className="w-[150px] bg-[#FF8C62] text-white py-2 cursor-pointer font-semibold mt-6">註冊</button>
                }

                <Link href="/login">
                    <p className="text-center mt-2 text-sm cursor-pointer hover:underline">登入會員</p>
                </Link>
            </form>
        </CatWrapper>
    )
}