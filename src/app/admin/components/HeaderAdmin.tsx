"use client";

import Modal from "@/app/components/Modal";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function HeaderAdmin() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full sticky top-0 h-[70px] border-b-1 border-admin-gray bg-white z-1 flex justify-between items-center">
            <div className="w-[90%] lg:w-[98%] m-auto flex justify-between items-center">
                <p className="text-primary-green text-2xl">長青宿舍後台管理</p>

                <div className="flex items-center">
                    {/*  手機漢堡選單按鈕(管理員) */}
                    <button className="lg:hidden cursor-pointer mr-3" onClick={() => setMenuOpen(true)}>
                        <svg className="size-8 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex items-center">
                        <img src="/icons/member/Headshot.svg" className="size-10 mr-2" />
                        <p className="hidden sm:flex">管理員，您好！</p>
                    </div>
                </div>    
            </div>

            {/* 開啟手機選單 */}
            <Modal isOpen={menuOpen} onClose={() => setMenuOpen(false)} position="top">
                <div className="flex flex-col items-center w-full bg-white mt-15">
                    <Sidebar />
                </div>
            </Modal>
        </header>
    )
}