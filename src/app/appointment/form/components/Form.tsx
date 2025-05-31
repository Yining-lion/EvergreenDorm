"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Buttons";
import SectionLayout from "@/app/components/SectionLayout";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";



export default function Form () {
    const router = useRouter();

    const [formData, setFormData] = useState({
    name: "",
    grade: "",
    phone: "",
    email: "",
    moveInDate: "",
    roomType: "",
    visitTime: "",
    referrer: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const { name, grade, phone, email, moveInDate, roomType, visitTime } = formData;

        // 判斷必填欄位是否有空值
        if (!name || !grade || !phone || !email || !moveInDate || !roomType || !visitTime) {
            alert("請完整填寫所有必填欄位！");
            return;
        }

        try {
            await addDoc(collection(db, "appoinments"), {
                ...formData,
                createdAt: serverTimestamp(),
            });

            router.push("/appointment/thankyou")

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("提交失敗，請稍後再試！");
        }
    };

    return (
        <SectionLayout title="預約看房">
            <form className="relative bg-white shadow-[var(--shadow-black)] rounded-xs max-w-3xl mx-auto -mt-20 p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray">
                    <div>
                        <label className="block mb-1 text-lg">姓名</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">學校系級</label>
                        <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">聯絡電話</label>
                        <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">聯絡信箱</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">期望入住日期</label>
                        <input
                        type="date"
                        name="moveInDate"
                        value={formData.moveInDate}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">期望房型</label>
                        <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        >
                            <option value="">請選擇</option>
                            <option value="單人套房">單人套房</option>
                            <option value="單人雅房">單人雅房</option>
                            <option value="雙人雅房">雙人雅房</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">預約看房時間</label>
                        <input
                        type="datetime-local"
                        name="visitTime"
                        value={formData.visitTime}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">推薦人（若無可不填寫）</label>
                        <input
                        type="text"
                        name="referrer"
                        value={formData.referrer}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                </div>

                <p className="text-red-500 font-semibold text-center my-10">請務必詳細閱讀預約說明後再進行下一步預約，本宿舍保留是否同意提供看房之最終決定權</p>

                <div className="flex justify-between">
                <Button variant="brown" onClick={() => router.back()}>
                    上一頁
                </Button>
                <Button type="submit" variant="brown" onClick={handleSubmit}>
                    送出
                </Button>
                </div>

            </form>
        </SectionLayout>
    )
}