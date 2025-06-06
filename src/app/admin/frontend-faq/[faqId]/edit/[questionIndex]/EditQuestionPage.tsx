"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function EditQuestionPage() {
  const router = useRouter();
  const { faqId, questionIndex } = useParams();

  const [category, setCategory] = useState<string>();
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      const docRef = doc(db, "faq", faqId as string);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) return;
      
      const data = snapshot.data();
      const category = data.category;
      setCategory(category);

      const description = data.descriptions?.[Number(questionIndex)];
      if (description) {
          setQuestion(description.question || "");
          setAnswer(description.answer || "");
      }
      
      setIsLoading(false);
    };
    fetchCategory();
  }, [faqId]);

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) {
        alert("請填寫完整資訊");
        return;
    }
    if (!auth.currentUser) return;

    const docRef = doc(db, "faq", faqId as string);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return;

    const data = snapshot.data();
    const descriptions = data.descriptions || [];
    descriptions[Number(questionIndex)] = {
        ...descriptions[Number(questionIndex)],
        question: question,
        answer: answer,
    };

    await updateDoc(docRef, { descriptions });

    alert("修改成功！");
    router.back();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-gray mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-faq")}>
          住宿QA
        </span>
        / <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/frontend-faq/${faqId}`)}>
          {category}
        </span> / 修改
      </p>

      <div className="flex flex-col items-start gap-4">
        
        
        <label className="mt-4 text-gray">問題：</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 text-gray bg-white"
          required
        />

        <label className="mt-4 text-gray">答案：</label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="w-full p-2 text-gray bg-white"
          rows={5}
          required
        />
        
        <button
          onClick={handleAdd}
          className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 mt-4 w-30 disabled:opacity-50 cursor-pointer"
        >
          修改
        </button>
      </div>
    </div>
  );
}
