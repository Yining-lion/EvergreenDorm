"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { ChurchContent, useFetchChurchContents } from "@/app/components/Church/useFetchChurch";

export default function EditChurchContent() {
    const router = useRouter();
    const { churchContents, loading } = useFetchChurchContents();

    const [selectId, setSelectId] = useState<string>("");
    const [editedchurchContents, setEditedchurchContents] = useState<ChurchContent[]>([]);
    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        setEditedchurchContents(churchContents);
    }, [churchContents]);

    useEffect(() => {
        if (!selectId) return;

        const fetchDescription = async () => {
            const docRef = doc(db, "churchContent", selectId as string);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) return;
            
            const data = snapshot.data();
            const description = data.description || [];
            setDescription(description);
        };
        fetchDescription();
    }, [selectId]);

    const handleUpdate = async () => {
        if (!description.trim() || !selectId) {
            alert("請填寫完整資訊");
            return;
        }
        if (!auth.currentUser) return;

        const docRef = doc(db, "churchContent", selectId as string);

        await updateDoc(docRef, {description: description});

        alert("修改成功！");
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="p-6 max-w-3xl mx-auto">
        <p className="text-gray mb-4">
            <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-church")}>
            修會介紹
            </span>
            / 緣起與願景
        </p>

        <div className="flex flex-col items-start gap-4">               
            <label className="mt-4 text-gray">選擇名稱：</label>
            <select
            value={selectId}
            onChange={(e) => setSelectId(e.target.value)}
            className="w-full p-2 text-gray bg-white"
            required
            >
                <option value="">請選擇</option>
                {editedchurchContents.map((content) => (
                    <option key={content.uid} value={content.uid}>{content.title}</option>
                ))}
            </select>

            <label className="mt-4 text-gray">內容：</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 text-gray bg-white resize-none"
            rows={8}
            required
            />
            
            <button
            onClick={handleUpdate}
            className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 mt-4 w-30 disabled:opacity-50 cursor-pointer"
            >
            修改
            </button>
        </div>
        </div>
    );
}
