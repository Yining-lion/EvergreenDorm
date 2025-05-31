"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const path = usePathname();
    const [open, setOpen] = useState<Record<string, boolean>>({});

    // 在組件初次載入時，展開當前所屬的主選單
    useEffect(() => {
        const matched = menu.find((item) =>
            item.sub?.some((sub) => sub.path === path)
        );
        if (matched) {
            setOpen((prev) => ({
                ...prev,
                [matched.title]: true,
            }));
        }
    }, [path]);

    const toggle = (title: string) => {
        setOpen( (prev) => ({
            ...prev,
            [title]: !prev[title]
        }))
    }

    const menu = [
        {
            title: "房型管理",
            sub: [
                { title: "房型統計", path: "/admin" },
                { title: "房間清單", path: "/admin/rooms" }
            ],
        },
        {
            title: "會員管理",
            sub: [
                { title: "審核帳號", path: "/admin/member-verify" },
                { title: "會員資料與編輯", path: "/admin/member-info" }
            ],
        },
        {
            title: "聊天室",
            sub: [
                { title: "全體及雅房", path: "/admin/chat" },
                { title: "個人", path: "/admin/chat-private" }
            ]
        },
        {
            title: "水電費",
            sub: [
                { title: "基本度數設定", path: "/admin/bill-base" },
                { title: "水電費計算", path: "/admin/bill-calculate" },
                { title: "確認通知並發送", path: "/admin/bill-notify" }
            ]
        },
        {
            title: "包裹",
            sub: [
                { title: "包裹通知", path: "/admin/parcel" },
            ]
            
        },
        {
            title: "前台內容",
            sub: [
                { title: "環境介紹", path: "/admin/frontend-environment" },
                { title: "住宿QA", path: "/admin/frontend-faq" },
                { title: "修會介紹", path: "/admin/frontend-church" },
                { title: "活動影像", path: "/admin/frontend-activity" }
            ]
        },
        {
            title: "預約通知",
            sub: [
                { title: "通知", path: "/admin/appoinment-notify" },
                { title: "紀錄", path: "/admin/appoinment-record" }
            ]
        }
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-admin-gray overflow-y-auto">
            <nav className="">
                {menu.map((item) => (
                    <div key={item.title} className="border-b border-admin-gray">
                        <div
                        className={
                        `flex items-center justify-between px-5 py-2 text-lg font-medium cursor-pointer
                        ${open[item.title] ? "bg-primary-green text-white shadow-[var(--shadow-black)]" : "text-gray hover:text-primary-green" }
                        `}
                        onClick={ () => toggle(item.title) }
                        >
                            {item.title}
                            <img src={open[item.title] ? "/icons/admin/Forward-1.svg" : "/icons/admin/Forward.svg"} className="size-6"></img>
                        </div>
                        {open[item.title] && item.sub && (
                            <div className="bg-admin-gray py-3">
                                {item.sub.map((sub) => {
                                    const isActive = path === sub.path;
                                    return (
                                    <Link href={sub.path} key={sub.title} >
                                        <div className={`flex items-center pl-5 py-2 text-gray-600 hover:text-primary-green cursor-pointer
                                            ${isActive ? "bg-white text-primary-green" : ""}`}>
                                            <img src="/icons/admin/Next Page.svg" className="size-5 mr-2"></img>
                                            <p>{sub.title}</p> 
                                        </div>
                                    </Link>

                                )})}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    )
}