"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Buttons";
import SectionLayout from "@/app/components/SectionLayout";
import { db } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns-tz"

export default function Form () {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

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

    const [moveInDate, setMoveInDate] = useState<Date | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    };

    const getMinTime = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(10, 0, 0, 0); // 10:00 AM
        return date;
    };

    const getMaxTime = () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(18, 0, 0, 0); // 6:00 PM
        return date;
    };

    useEffect(() => {
        const tomorrowAt10AM = new Date(); // ex: Wed Jun 18 2025 10:00:00 GMT+0800 (台北標準時間)
        tomorrowAt10AM.setDate(tomorrowAt10AM.getDate() + 1);
        tomorrowAt10AM.setHours(10, 0, 0, 0); // 明天 10:00 AM
        setSelectedDate(tomorrowAt10AM);

        if (selectedDate) {
            const taiwanTime = format(selectedDate, "yyyy-MM-dd HH:mm", {
                timeZone: "Asia/Taipei",
            });
            console.log(taiwanTime)

            setFormData((prev) => ({
                ...prev,
                visitTime: taiwanTime,
            }));
        }
    }, []);

    // 同步 DatePicker 選擇變動到 formData
    useEffect(() => {
        if (moveInDate) {
            const taiwanDate = format(moveInDate, "yyyy-MM-dd", {
                timeZone: "Asia/Taipei",
            });
            console.log(taiwanDate)
            setFormData((prev) => ({
                ...prev,
                moveInDate: taiwanDate,
            }));
        }
    }, [moveInDate]);

    useEffect(() => {
        if (selectedDate) {

            const taiwanTime = format(selectedDate, "yyyy-MM-dd HH:mm", {
                timeZone: "Asia/Taipei",
            });

            setFormData((prev) => ({
                ...prev,
                visitTime: taiwanTime,
            }));
        }
    }, [selectedDate]);

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

        if (!/^09\d{8}$/.test(phone)) {
            alert("請輸入有效的台灣手機號碼");
            return;
        }
        setIsLoading(true)
        try {

            const res = await fetch("/api/email/formSubmit", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            if(res.ok){
                await addDoc(collection(db, "appoinments"), {
                    ...formData,
                    createdAt: serverTimestamp(),
                });
                router.push("/appointment/thankyou")
            } else {
                const errorData = await res.json();
                alert(`發送失敗：${errorData.error}`);
            }

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("提交失敗，請稍後再試！");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SectionLayout title="預約看房">
            <form className="relative bg-white shadow-[var(--shadow-black)] rounded-xs max-w-3xl mx-auto -mt-20 p-10 w-[90%] md:w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray">
                    <div>
                        <label className="block mb-1 sm:text-lg">姓名</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">學校系級</label>
                        <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">聯絡電話</label>
                        <input
                        type="tel"
                        name="phone"
                        pattern="^09\d{8}$"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">聯絡信箱</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">期望入住日期</label>
                        <DatePicker
                        selected={moveInDate}
                        onChange={(date) => setMoveInDate(date)}
                        minDate={getMinDate()} // 只能選明天之後
                        dateFormat="yyyy-MM-dd"
                        wrapperClassName="w-full"
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">期望房型</label>
                        <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        >
                            <option value="">請選擇</option>
                            <option value="單人套房">單人套房</option>
                            <option value="單人雅房">單人雅房</option>
                            <option value="雙人雅房">雙人雅房</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">預約看房時間</label>
                        <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        showTimeSelect
                        timeIntervals={15} // 每 15 分鐘為單位
                        dateFormat="yyyy-MM-dd HH:mm"
                        minDate={getMinDate()} // 只能選明天之後
                        minTime={getMinTime()} // 10:00
                        maxTime={getMaxTime()} // 18:00
                        wrapperClassName="w-full"
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 sm:text-lg">推薦人（若無可不填寫）</label>
                        <input
                        type="text"
                        name="referrer"
                        value={formData.referrer}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-1.5 sm:p-2 focus:outline-none"
                        />
                    </div>
                </div>

                <p className="text-red-500 font-semibold text-center text-sm sm:text-base my-10">請務必詳細閱讀預約說明後再進行下一步預約，本宿舍保留是否同意提供看房之最終決定權</p>

                <div className="flex justify-between">
                    <Button variant="brown" onClick={() => router.back()}>上一頁</Button>
                    { isLoading ? 
                    <Button  variant="brown" className="flex justify-center">
                        <div className="w-6 h-6 border-3 border-white border-t-primary-brown rounded-full animate-spin"></div>
                    </Button>:
                    <Button type="submit" variant="brown" onClick={handleSubmit}>送出</Button>
                    }
                </div>
            </form>
        </SectionLayout>
    )
}