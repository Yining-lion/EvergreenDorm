"use client"

import Button from "@/app/components/Buttons";
import SectionLayout from "@/app/components/SectionLayout";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Guidelines () {
    const router = useRouter();

    return (
        <SectionLayout title="預約說明">
            <div className="relative bg-white shadow-[var(--shadow-black)] rounded-xs max-w-3xl mx-auto -mt-20 p-10">
                <p className="text-red-500 font-semibold text-center">請務必詳細閱讀預約說明後再進行下一步預約，本宿舍保留是否同意提供看房之最終決定權</p>
                <ol className="list-decimal space-y-5 text-gray text-lg leading-relaxed mt-7 mb-20 pl-5">
                    <li>
                        <strong>預約時間確認：</strong> 預約看房需於 <span className="text-red-500">至少 24 小時前提出申請</span>，並請準時赴約，若需更改時間請提前<span className="text-red-500"> 至少 24 小時通知</span>。
                    </li>
                    <li>
                        <strong>提供完整資訊：</strong> 請確實填寫所有欄位，尤其是聯絡電話與聯絡信箱，以便我們聯絡您確認預約或提供進一步資訊。若無推薦人可留白。
                    </li>
                    <li>
                        <strong>住宿安排說明：</strong> 本預約申請僅為看房用途，不代表已保證入住。是否提供入住與房型安排，將視實際情況與宿舍政策而定。
                    </li>
                    <li>
                        <strong>遲到與取消：</strong> 若遲到超過 15 分鐘且未事先通知，將視同取消。無故爽約兩次以上者，將列入黑名單，恕不再接受預約。
                    </li>
                    <li>
                        <strong>目前剩餘房間數：</strong> 單人套房 0 間、單人雅房 0 間、雙人雅房 0 間。若無剩餘房間數，僅提供環境參觀。如欲了解各房型內容，請至 <Link href="/environment" className="hover:underline">環境介紹</Link> 頁面查看。
                    </li>
                </ol>
                <Button 
                variant="brown" 
                className="absolute bottom-10 right-10"
                onClick={() => router.push("/appointment/form" )}
                >下一頁</Button>

            </div>
        </SectionLayout>
    )
}