"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage, auth } from "@/app/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { handleImageChange } from "@/app/lib/handleImageChange";

export default function AddSisterPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(e, {
        maxSizeMB: 10,
        onValid: (file, url) => {
            setFile(file);
            setPreviewURL(url);
        },
        });
    };

    const handleAdd = async () => {
        if (!file) {
            alert("請選擇圖片");
            return;
        }
        if (!name || !description) {
            alert("請填寫完整資訊");
            return;
        }
        if (!auth.currentUser) return;

        // 上傳圖片
        const fileName = `${Date.now()}.jpg`;
        const storageRef = ref(storage, `aboutSister/${fileName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // 將圖片資料加入 Firestore
        const docRef = collection(db, "aboutSister");
        await addDoc(docRef, { 
            name: name,
            description: description,
            photoURL: downloadURL,
            createdAt: new Date(),
        }
        );

        alert("新增成功！");
        router.back();
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
        <p className="text-gray">
            <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-church")}>
            修會介紹
            </span>
            / <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-church/aboutSister")}>
                關於修女
            </span> / 新增
        </p>

        <div className="flex flex-col items-start gap-4">
            {previewURL && (
                <img src={previewURL} alt="preview" className="w-64 h-64 object-cover mt-5" />
            )}
            <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 mt-4 w-30 disabled:opacity-50 cursor-pointer"
            >
                選擇圖片
            </button>
            <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleImage}
            required
            />

            <label className="mt-4 text-gray">姓名：</label>
            <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 text-gray bg-white"
            required
            />

            <label className="mt-4 text-gray">內容：</label>
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 text-gray bg-white resize-none"
            rows={8}
            required
            />

            <button
            onClick={handleAdd}
            className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 mt-4 w-30 disabled:opacity-50 cursor-pointer"
            >
                新增
            </button>
        </div>
        </div>
    );
}
