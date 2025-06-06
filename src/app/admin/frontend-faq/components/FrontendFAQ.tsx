"use client";

import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { useEffect, useState } from "react";
import useFetchFAQ, { FAQ } from "@/app/components/FAQ/useFetchFAQ";

export default function FrontendFAQ () {
    const router = useRouter();
    const { faqs: originalFaqs, loading } = useFetchFAQ();

    const [editedFaqs, setEditedFaqs] = useState<FAQ[]>([]);

    useEffect(() => {
        setEditedFaqs(originalFaqs)
    }, [originalFaqs]);

    if (loading) return <LoadingSpinner/>

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <tbody>
                        {editedFaqs.map((faq) => {
                    
                            return (
                                <tr key={faq.uid} className="h-12 hover:bg-green-50">
                                                                    
                                    <td className="border-t border-admin-gray">
                                        <p
                                        className="cursor-pointer"
                                        onClick={() => router.push(`/admin/frontend-faq/${faq.uid}`)}
                                        >{faq.category}
                                        </p>
                                    </td>

                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    )
}