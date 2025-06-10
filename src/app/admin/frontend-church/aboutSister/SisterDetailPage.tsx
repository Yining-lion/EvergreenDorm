"use client";

import { useRouter } from 'next/navigation'
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import { Sister, useFetchAboutSister } from "@/app/components/Church/useFetchChurch";
import SisterCard from "@/app/components/Church/SisterCard";

export default function SisterDetailPage () {
    const router = useRouter();

    const { sisters, loading } = useFetchAboutSister();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedSisters, setEditedSisters] = useState<Sister[]>([]);

    useEffect(() => {
        if(!sisters) return;
        setEditedSisters(sisters);
    }, [sisters]);

    const handleEditing = (sister: Sister) => {
    setEditingId(sister.uid);
    setEditedSisters([...sisters]);
    };

    const handleChange = (sisterId: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedSisters((prevSisters) =>
            prevSisters.map((sister) => {
                return sister.uid === sisterId ? { ...sister, [name]: value } : sister;
            })
        )
    };

    const handleDelete = async (sisterId: string, sisterName: string) => {
        const confirmDelete = confirm(`確定要刪除 ${sisterName}？`);
        if (!confirmDelete) return;

        const docRef = doc(db, "aboutSister", sisterId);
        await deleteDoc(docRef);

        // 前端更新狀態
        setEditedSisters((prev) => prev.filter((sister) => sister.uid !== sisterId));

        alert("刪除成功！");
    };

    const updateSister = async (sisterId: string) => {
            const sister = editedSisters.find((s) => s.uid === sisterId);
            if (!sister) return;
    
            const docRef = doc(db, "aboutSister", sisterId)
      
            await updateDoc(docRef, {
                name: sister.name,
                description: sister.description,
                updatedAt: new Date()
            });
            
            alert("更新成功！");
            setEditingId(null);
    };

    if (loading) return <LoadingSpinner/>

    return (
        <section className="max-w-3xl mx-auto">
            {/* 導覽列 & 新增鈕 */}
            <div className="text-gray mb-10 w-full flex items-center justify-between">
                <p className="text-gray">
                    <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-church")}>
                    修會介紹
                    </span>
                    / 關於修女
                </p>

                <img 
                src="/icons/admin/Joyent.svg" 
                alt="add" 
                className="size-12 cursor-pointer"
                onClick={() => router.push(`/admin/frontend-church/aboutSister/add`)}
                />
            </div>
            
            <SisterCard 
            sisters={editedSisters}
            onOpen={editingId === null}
            onEdit={handleEditing}
            onDelete={handleDelete}
            onChange={handleChange}
            editingId={editingId}
            updateSister={updateSister}
            />
        </section>
    )
}