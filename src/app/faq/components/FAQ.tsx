"use client";

import SectionLayout from '@/app/components/SectionLayout';
import { useState } from 'react';
import useFetchFAQ from '@/app/components/FAQ/useFetchFAQ';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { AnimatePresence, motion } from "framer-motion";
import FAQItem from './FAQItem';

const tabs = [
    { label: "設備與使用", icon: "/icons/FAQ/Wrench.svg", iconHover: "/icons/FAQ/Wrench-1.svg"},
    { label: "清潔與安全", icon: "/icons/FAQ/Broom.svg", iconHover: "/icons/FAQ/Broom-1.svg"},
    { label: "入住與退宿", icon: "/icons/FAQ/Traveler.svg", iconHover: "/icons/FAQ/Traveler-1.svg"},
    { label: "住宿與生活", icon: "/icons/FAQ/Person at Home.svg", iconHover: "/icons/FAQ/Person at Home-1.svg"},
] as const;

type TabLabel = typeof tabs[number]["label"];

export default function FAQContent() {
  const { faqs, loading } = useFetchFAQ();
  const [activeTab, setActiveTab] = useState<TabLabel>("設備與使用");

  const activeFaq = faqs.find((faq) => faq.category === activeTab);

  if (loading) return <LoadingSpinner/>

  return (
    <SectionLayout title="住宿QA">
        <div className="flex justify-center gap-10 flex-wrap mb-8 -mt-15">
          {tabs.map((tab) => (
              <button
              key={tab.label}
              className={`flex flex-col items-center px-4 py-2 rounded-full transition`}
              onClick={() => {setActiveTab(tab.label);}}
              >
                  <img 
                  src={`${activeTab === tab.label ? tab.icon : tab.iconHover}`}
                  className={`bg-white size-25 p-5 rounded-full cursor-pointer 
                    ${activeTab === tab.label ? "shadow-[var(--shadow-primary-green)]" : "shadow-[var(--shadow-black)]"}`}></img>
                  <span className="text-lg">{tab.label}</span>
              </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeFaq && (
            <motion.div
              key={activeFaq.category}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 max-w-2xl mx-auto w-[90%] md:w-full"
            >
              {activeFaq.descriptions.map((description) => (
                <FAQItem
                  key={description.question}
                  question={description.question}
                  answer={description.answer}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
    </SectionLayout>
  );
}
