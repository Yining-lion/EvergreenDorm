"use client";

import { useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import Button from "./Buttons";
import { navItems } from "../constants/navItems";
import Modal from "./Modal";
import { useAuth } from "../auth/authContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const isLoggedIn = !!user;

  if (loading) return null;

  return (
  <header className="w-full sticky top-0 h-[70px] border-b-1 border-pink-50 bg-white z-1 flex justify-between items-center">
      <div className="w-[90%] xl:w-[1200px] m-auto flex justify-between items-center">

          <Link href="/">
            <Image src="/images/logo.png" alt="長青宿舍" width={180} height={150} className="w-[150px] xs:w-[180px] "/>
          </Link>

          <nav className="hidden lg:flex items-center text-gray text-lg">
            {navItems.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <Link
                  href={item.href}
                  className="hover:text-primary-green transition-colors duration-200"
                >
                  {item.label}
                </Link>
                {index < navItems.length - 1 && (
                  <span className="mx-3 text-gray-300">|</span>
                )}
              </div>
            ))}
          </nav>

          {/* 會員登入判斷 */}
          {isLoggedIn ? (
            <div className="flex items-center">
              {/*  手機漢堡選單按鈕(會員) */}
              <button className="lg:hidden cursor-pointer mr-3" onClick={() => setMenuOpen(true)}>
                <svg className="size-8 text-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* <div className="border border-gray-300 h-10 mr-5"></div> */}
              {/* <img src="/icons/member/Bell.svg" className="size-10 mr-2" /> */}
              <Link href="/member">
                <img src={user.photoURL as string || "/icons/member/Headshot.svg"} className="size-10 object-cover rounded-full" />
              </Link>
            </div>
          ) : ( 
            <div className="hidden lg:flex">
              <Link href="/appointment">
                <Button variant="green" className="px-5 py-3 rounded-full text-lg w-[120px] mr-5">預約看房</Button>
              </Link>
              <Link href="/login">
                <Button variant="green" className="px-5 py-3 rounded-full w-[120px] text-lg">登入/註冊</Button>              
              </Link>
            </div>
          )}

          {!isLoggedIn && (
            <button className="lg:hidden cursor-pointer" onClick={() => setMenuOpen(true)}>
              <svg className="size-10 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

        </div>

        {/* 開啟手機選單 */}
        <Modal isOpen={menuOpen} onClose={() => setMenuOpen(false)} position="top">
          <div className="flex flex-col items-center w-full bg-white px-6 pt-6 pb-10">

            <nav className="flex flex-col gap-3 text-lg text-gray text-center">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-primary-green transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            { !isLoggedIn && (
              <div className="flex flex-col gap-3 w-full mt-10 max-w-[150px]">
                <Link href="/appointment" onClick={() => setMenuOpen(false)}>
                  <Button variant="green" className="w-full py-3 text-lg rounded-full">預約看房</Button>
                </Link>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="green" className="w-full py-3 text-lg rounded-full">登入/註冊</Button>
                </Link>
              </div>
            )}

          </div>
        </Modal>
  </header>
  )
}