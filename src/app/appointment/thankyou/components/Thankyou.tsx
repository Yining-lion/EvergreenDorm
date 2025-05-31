"use client"

import Button from "@/app/components/Buttons";
import SectionLayout from "@/app/components/SectionLayout";
import Link from "next/link";

export default function Thankyou () {

    return (
        <SectionLayout title="預約看房">
            <div className="flex flex-col items-center bg-white shadow-[var(--shadow-black)] rounded-xs max-w-3xl mx-auto -mt-20 p-10">             
                <img src="/icons/appointment/Success.svg" className="size-28"></img>

                <div className="flex flex-col gap-1 items-center text-lg mt-8 mb-10">
                    <p>您已成功送出！</p>
                    <p>請至您的電子信箱查收登記資訊，並敬請於預約時間準時抵達</p>
                    <p>如有任何疑問歡迎與我們聯繫</p>
                    <p>電話：(02) 2903-0610</p>
                    <p>Email：evergreen@example.com</p>
                </div>
                <Link href="/">
                    <Button variant="green" className="px-5 py-3 rounded-full text-lg w-[130px]">回首頁</Button>
                </Link>

            </div>
        </SectionLayout>
    )
};

