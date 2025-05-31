"use client";

import Link from 'next/link';
import { subNavItems } from '@/app/constants/navItems'; 
import { usePathname } from 'next/navigation';

export default function SubHeader () {
    const pathname = usePathname();

    return (
    <header className="w-full sticky top-[70px] border-b-1 border-pink-50 bg-white z-1">
        <div className="w-[90%] lg:w-[1200px] m-auto py-3 flex justify-between items-center px-3">
            <nav className="flex items-center text-gray text-lg">
                {subNavItems.map((item, index) => {
                    const isActive = pathname === item.href;

                    return (
                    <div key={item.label} className="flex items-center">
                        <Link
                        href={item.href}
                        className={`transition-colors duration-200 ${
                            isActive ? "text-primary-green" : "text-gray"
                        }`}
                        >
                        {item.label}
                        </Link>
                        {index < subNavItems.length - 1 && (
                        <span className="mx-3 text-gray-300">|</span>
                        )}
                    </div>
                    );
                })}
            </nav>
        </div>
  </header>
    )
}