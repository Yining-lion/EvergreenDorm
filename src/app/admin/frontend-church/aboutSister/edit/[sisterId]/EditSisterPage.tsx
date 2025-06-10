"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/app/lib/firebase";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { handleImageChange } from "@/app/lib/handleImageChange";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditSisterPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { sisterId } = useParams();
    const [name, setName] = useState<string>();
    const [description, setDescription] = useState("");
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageChange(e, {
        maxSizeMB: 10,
        onValid: (file, previewURL) => {
            setFile(file);
            setPhotoURL(previewURL);
        },
        });
    };

    const uploadImage = async () => {
        if (!file) return null;
        // 上傳至 firebase storage
        const storageRef = ref(storage, `aboutSister/${Date.now()}.jpg`);
        await uploadBytes(storageRef, file);
        // 下載圖片 URL
        const downloadURL = await getDownloadURL(storageRef);
        setPhotoURL(downloadURL);
        return downloadURL;
    } 

    const handleUpdate = async () => {
        
        if (!name || !description) alert("請填寫完整資訊");

        if (!auth.currentUser) return;

        // 使用者若沒上傳圖片檔案 用預設值
        let uploadedPhotoURL = photoURL;

        if (file) {
            uploadedPhotoURL = await uploadImage();
        }

        const docRef = doc(db, "aboutSister", sisterId as string);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return;

         await updateDoc(docRef, {
            name,
            description,
            photoURL: uploadedPhotoURL,
            updatedAt: new Date()
        });

        alert("更新成功！");
        router.back();
    };

    useEffect(() => {
        const fetchImage = async () => {
            const docRef = doc(db, "aboutSister", sisterId as string);
            const snapshot = await getDoc(docRef);
            if (!snapshot.exists()) return;

            const data = snapshot.data();
            setName(data.name);
            setDescription(data.description);
            setPhotoURL(data.photoURL);
            setIsLoading(false);
        };

        fetchImage();
    }, [sisterId]);

  if (isLoading) return <LoadingSpinner/>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <p className="text-gray mb-4">
                <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-church")}>
                修會介紹
                </span>
                / <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-church/aboutSister")}>
                    關於修女
                </span> / 修改
            </p>

            <div className="flex flex-col items-start gap-4">     
            <img src={photoURL ?? ""} alt="preview" className="w-64 h-64 object-cover bg-gray-200" />
            <div>
                <button 
                className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 mt-4 w-30 disabled:opacity-50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                >上傳圖片</button>
                <input
                ref={fileInputRef}
                type="file"
                accept=".jpg, .jpeg, .png"
                className="hidden"
                onChange={handleImage}
                />
            </div>

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
                onClick={handleUpdate}
                className="bg-primary-green hover:bg-green-700 text-white px-4 py-2 mt-4 w-30 disabled:opacity-50 cursor-pointer"
            >
                修改
            </button>
            </div>
        </div>
    );
}
