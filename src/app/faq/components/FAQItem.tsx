"use client";
import { useState } from "react";
import AnimateHeight from "react-animate-height";

type FAQItemProps = {
  question: string;
  answer: string;
};

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
    className={`bg-white rounded-lg p-4 transition-all duration-200 cursor-pointer 
        ${isOpen ? "shadow-[var(--shadow-primary-green)]" : "shadow-[var(--shadow-black)]"}
        hover:shadow-[var(--shadow-primary-green)]`}
    onClick={() => setIsOpen(!isOpen)}
    >

      <button className="cursor-pointer text-base sm:text-lg font-medium flex items-center">
        <span className={`transition-transform duration-300 mr-3 ${isOpen ? "rotate-90" : ""}`}>▶</span>
        {question}
      </button>

      <AnimateHeight duration={300} height={isOpen ? "auto" : 0}>
        <div className="mt-3 whitespace-pre-wrap">{answer}</div>
      </AnimateHeight>

    </div>
  );
}
