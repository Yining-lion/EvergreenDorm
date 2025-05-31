"use client";

import { ReactNode } from "react";

type SectionLayoutProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function SectionLayout({ title, children, className = "" }: SectionLayoutProps) {
  return (
    <div className="flex flex-col justify-center text-gray">
      <h2 className="text-center text-2xl font-semibold mt-5">{title}</h2>
      <img src="/icons/home/Uderline.svg" alt="underline" className="w-50 mx-auto" />

      <main className={`bg-primary-pink mt-[100px] pb-10 ${className}`}>
        {children}
      </main>
    </div>
  );
}
