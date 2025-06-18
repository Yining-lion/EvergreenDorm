"use client";

import { ReactElement, useState } from 'react';
import HistoryVision from './History&Vision';
import AboutSister from './AboutSister';
import SectionLayout from '@/app/components/SectionLayout';

const tabs = [
    { label: "緣起與願景", icon: "/icons/church/Time Machine.svg", iconHover: "/icons/church/Time Machine-1.svg"},
    { label: "關於修女", icon: "/icons/church/Ankh.svg", iconHover: "/icons/church/Ankh-1.svg"},
] as const;

type TabLabel = typeof tabs[number]['label'];

// Record<K, V> 泛型型別
const tabComponents: Record<TabLabel, ReactElement> = {
  "緣起與願景": <HistoryVision />,
  "關於修女": <AboutSister />,
};

export default function ChurchContent() {

    const [activeTab, setActiveTab] = useState<TabLabel>("緣起與願景");

    return (
    <SectionLayout title="修會介紹">
        <div className="flex justify-center gap-10 flex-wrap mb-8 -mt-15">
        {tabs.map((tab) => (
            <button
            key={tab.label}
            className={`flex flex-col items-center px-4 py-2 rounded-full transition`}
            onClick={() => setActiveTab(tab.label)}
            >
                <img 
                src={`${activeTab === tab.label ? tab.icon : tab.iconHover}`} 
                className={`bg-white size-25 p-5 rounded-full cursor-pointer
                ${activeTab === tab.label ? "shadow-[var(--shadow-primary-green)]" : "shadow-[var(--shadow-black)]"}`}></img>
                <span className="text-lg">{tab.label}</span>
            </button>
        ))}
        </div>

        <div className="mt-6">
            {tabComponents[activeTab]}
        </div>
    </SectionLayout>
    );
}