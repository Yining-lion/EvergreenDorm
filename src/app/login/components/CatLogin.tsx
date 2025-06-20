"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CatWrapper from "@/app/components/CatWrapper"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Link from "next/link"
import { useAuth } from "@/app/auth/authContext";

const errorMessages: { [key: string]: string } = {
  "auth/invalid-email": "無效的電子郵件格式",
  "auth/internal-error": "系統錯誤，請稍後再試",
  "auth/invalid-credential": "帳號或密碼錯誤，請再試一次",
};

export default function CatLogin () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user, loading } = useAuth();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            if (err && typeof err === "object" && "code" in err && "message" in err) {
                const firebaseError = err as { code: string; message: string };
                const errorCode = firebaseError.code;
                const errorMessage = errorMessages[errorCode] || "登入失敗，請再試一次";
                setMessage(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (loading) return;

        if (user?.role === "admin") {
            router.push("/admin/roomType");
        } else if (user?.role === "member") {
            router.push("/");
        } else {
            router.push("/login");
        }
    }, [user, loading]);

    return (
        <CatWrapper>
            <form onSubmit={handleLogin} className="relative w-[220px] xs:w-[250px] m-auto flex flex-col items-center">
                <h2 className="text-center text-2xl font-bold mb-4">登入會員</h2>

                <div className="flex items-center w-full mb-2 bg-primary-orange p-2">
                    <img src="/icons/login/Email.svg" alt="email" className="size-5 mr-2"></img>
                    <input 
                    type="email" 
                    placeholder="電子信箱" 
                    className="focus:outline-none w-full truncate"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setMessage("")}
                    required
                    />
                </div>
                <div className="flex items-center w-full mb-2 bg-primary-orange p-2">
                    <img src="/icons/login/Lock.svg" alt="password" className="size-5 mr-2"></img>
                    <input 
                    type="password" 
                    placeholder="密碼" 
                    className="focus:outline-none w-full truncate"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setMessage("")}
                    required
                    />
                </div>

                <div className="flex gap-2 w-full px-1 text-sm text-orange-600 cursor-pointer">
                    <span
                    className="hover:underline"
                    onClick={() => {
                        setEmail("test@gmail.com");
                        setPassword("123456");
                    }}>
                        測試會員
                    </span>
                    <span 
                    className="hover:underline"
                    onClick={() => {
                        setEmail("admin@gmail.com");
                        setPassword("987654");
                    }}>
                        測試管理員
                    </span>
                </div>

                {/* <p className="absolute right-0 bottom-28 text-sm cursor-pointer hover:underline">忘記密碼？</p> */}

                {message && (
                    <p className="absolute bottom-19 text-sm text-red-600">
                        {message}
                    </p>
                )}

                { isLoading ? 
                <div className="w-[150px] bg-[#FF8C62] py-2 font-semibold mt-12 flex justify-center">
                    <div className="w-6 h-6 border-3 border-white border-t-[#FF8C62] rounded-full animate-spin"></div>
                </div>:
                <button type="submit" className="w-[150px] bg-[#FF8C62] text-white py-2 cursor-pointer font-semibold mt-12">登入</button>
                }

                <Link href="/signup">
                    <p className="text-center mt-2 text-sm cursor-pointer hover:underline">註冊會員</p>
                </Link>
            </form>
        </CatWrapper>
    )
}