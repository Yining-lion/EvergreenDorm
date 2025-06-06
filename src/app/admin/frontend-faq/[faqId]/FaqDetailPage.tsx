"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { FAQ } from "@/app/components/FAQ/useFetchFAQ";

export default function FaqDetailPage() {
  const router = useRouter();
  const { faqId } = useParams();
  const [faq, setFaq] = useState<FAQ | null>(null);

    const handleDeleteQuestion = async (index: number) => {
        if (!faq) return;
        const updatedFaqs = [...faq.descriptions];
        const confirmDelete = confirm(`確定要刪除 ${faq.descriptions[index].question}`)
        if (!confirmDelete) return;
        
        updatedFaqs.splice(index, 1);
        await updateDoc(doc(db, "faq", faq.uid), {
            descriptions: updatedFaqs
        });
        setFaq({ ...faq, descriptions: updatedFaqs });
    };


  useEffect(() => {
    const fetchFaq = async () => {
        const docRef = doc(db, "faq", faqId as string);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            const data = snapshot.data() as Omit<FAQ, "uid">;
            setFaq({ uid: snapshot.id, ...data });
        }
      };
      fetchFaq();
    }, [faqId]);

    if (!faq) return <LoadingSpinner/>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* 導覽列 & 新增鈕 */}
      <div className="text-gray mb-4 w-full flex items-center justify-between">
        <p>
          <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-faq")}>住宿QA</span>
          / {faq.category}
        </p>

        <img 
        src="/icons/admin/Joyent.svg" 
        alt="add" 
        className="size-12 cursor-pointer"
        onClick={() => router.push(`/admin/frontend-faq/${faq.uid}/add`)}
        />
      </div>

      <div className="flex flex-col items-end">
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <tbody>
                        {faq.descriptions.map((f, index) => {
                    
                            return (
                                <tr key={f.question} className="h-12 hover:bg-green-50">
                                                                    
                                    <td className="border-t border-admin-gray">
                                        <p className="text-left px-5">{f.question}</p>
                                    </td>

                                    <td className="border-t border-admin-gray">
                                        {/* 編輯刪除鈕 */}
                                        <div className="flex justify-end items-center px-5">
                                            <img src="/icons/admin/Edit.svg" alt="edit" className="size-8 cursor-pointer ml-2" onClick={() => router.push(`/admin/frontend-faq/${faq.uid}/edit/${index}`)}></img>
                                            <img src="/icons/admin/Delete.svg" alt="delete" className="size-8 cursor-pointer ml-2" onClick={() => handleDeleteQuestion(index)}></img>
                                        </div>
                                    </td>

                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
