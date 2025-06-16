"use client";

import Link from "next/link";

type FooterProps = {
    roofBgColor?: string; // default 白色
};

export default function Footer({ roofBgColor = 'bg-white' }: FooterProps) {

    return (
        <footer className="relative w-full bg-primary-brown text-white">

            {/* 屋頂 */}
            <div className={`w-full ${roofBgColor}`}>
                <svg className="w-full h-16" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polygon points="0,100 50,0 100,100" className="fill-primary-brown" />
                </svg>
            </div>

            {/* 冒煙煙囪 */}
            <div className="absolute right-15 xs:right-24 xl:right-60 top-0 scale-80 xs:scale-100">
                {/* 煙囪 */}
                <svg width="40" height="60" viewBox="0 0 40 60" className="relative z-1 fill-primary-brown">
                    <rect x="0" y="0" width="40" height="60" />
                </svg>
                {/* 煙 */}
                <img src="/icons/home/Cloud-1.svg" alt="煙" className="absolute [left:15px] [top:-15px]"/>
                <img src="/icons/home/Cloud-2.svg" alt="煙" className="absolute [left:45px] [top:-45px]"/>
                <img src="/icons/home/Cloud-3.svg" alt="煙" className="absolute [left:75px] [top:-75px]"/>
            </div>

            {/* 內容 */}
            <div className="relative pb-5 flex flex-col justify-center items-center">
                <div className="mb-4 mt-[-30px] sm:mt-0 text-left flex flex-col sm:flex-row justify-center items-center">
                    <Link href="https://www.facebook.com/Evergreen.dorm?locale=zh_TW" target="_blank" rel="noopener noreferrer" className="">
                        <img src="/icons/home/Facebook.svg" alt="Facebook" className="size-10 mb-2 sm:mb-0 sm:mr-2"/>
                    </Link>
                    <div className="text-sm sm:text-base">
                        <p>地址：新北市泰山區明志路三段42巷2號--<Link href="https://maps.app.goo.gl/PR9wJ3JN6HKkZ2UP7" target="_blank" rel="noopener noreferrer" className="hover:underline">查看地圖</Link></p>
                        <p>電話：(02)2903-0610</p>
                        <p>Email：evergreen@example.com</p>
                    </div>
                </div>
                <div className="text-xs text-center">
                    <p>© 2025 財團法人天主教聖母痛苦方濟傳教修女會(長青宿舍)</p>
                    <p>資訊安全政策、個人資料蒐集告知聲明</p>
                </div>
            </div>
        </footer>
    )
}