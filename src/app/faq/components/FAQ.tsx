"use client";

import { useState } from 'react';
import SectionLayout from '@/app/components/SectionLayout';

const tabs = [
    { label: "設備與使用", icon: "/icons/FAQ/Wrench.svg", iconHover: "/icons/FAQ/Wrench-1.svg"},
    { label: "清潔與安全", icon: "/icons/FAQ/Broom.svg", iconHover: "/icons/FAQ/Broom-1.svg"},
    { label: "入住與退宿", icon: "/icons/FAQ/Traveler.svg", iconHover: "/icons/FAQ/Traveler-1.svg"},
    { label: "住宿與生活", icon: "/icons/FAQ/Person at Home.svg", iconHover: "/icons/FAQ/Person at Home-1.svg"},
] as const;

type TabLabel = typeof tabs[number]["label"];

const qaData = {
  '設備與使用': [
    {
      question: 'Q1：宿舍有哪些基本設備？',
      answer: `1. 寢室內有床架、床墊、衣櫃、書桌椅、檯燈、冷氣、冷風、水桶、網路插座等\n2. 公共區域有會客室、廚房、浴廁、飲水機、投幣式洗烘衣機等`,
    },
    {
      question: 'Q2：使用公共廚房時需注意什麼？',
      answer: `請保持清潔並於使用完畢後立即清理，避免堆積垃圾與剩菜。`,
    },
  ],
  '清潔與安全': [
    {
      question: 'Q1：垃圾如何分類與清理？',
      answer: `請依照宿舍內張貼的分類指引分類垃圾，定期丟至指定地點。`,
    },
  ],
  '入住與退宿': [
    {
      question: 'Q1：入住時需注意哪些事項？',
      answer: `請配合辦理入住手續，並遵守宿舍相關規定與時間。`,
    },
  ],
  '住宿與生活': [
    {
      question: 'Q1：是否能養寵物或使用電器？',
      answer: `為了安全與整潔，宿舍禁止飼養寵物與使用高功率電器。`,
    },
  ],
};


export default function FAQContent() {

    const [activeTab, setActiveTab] = useState<TabLabel>("設備與使用");

    return (
    <SectionLayout title="住宿QA">
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

        <div className="space-y-4 max-w-2xl mx-auto">
          {qaData[activeTab].map((qa, index) => (
              <details
              key={index}
              className="group bg-white rounded-lg p-4 transition-all duration-200 shadow-[var(--shadow-black)] 
                        hover:shadow-[var(--shadow-primary-green)] open:shadow-[var(--shadow-primary-green)]"
                >
                <summary className="cursor-pointer text-lg font-medium flex items-center">
                  <span className="transition-transform duration-200 group-open:rotate-90 mr-3">▶</span>
                  {qa.question}
                </summary>
                <div className="mt-3 whitespace-pre-wrap">{qa.answer}</div>
              </details>
          ))}
        </div>
    </SectionLayout>
    );
}
