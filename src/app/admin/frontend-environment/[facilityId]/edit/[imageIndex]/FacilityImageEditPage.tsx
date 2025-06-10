"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "@/app/lib/firebase";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { handleImageChange } from "@/app/lib/handleImageChange";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function FacilityImageEditPage() {
    const router = useRouter();
    const user = auth.currentUser;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { facilityId, imageIndex } = useParams();
    const [category, setCategory] = useState<string>();
    const [newTitle, setNewTitle] = useState("");
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
        if (!file || !user) return null;
        // 上傳至 firebase storage
        const storageRef = ref(storage, `environment/${category}/${Date.now()}.jpg`);
        await uploadBytes(storageRef, file);
        // 下載圖片 URL
        const downloadURL = await getDownloadURL(storageRef);
        setPhotoURL(downloadURL);
        return downloadURL;
    } 

    const handleUpdate = async () => {       
        if (!newTitle) alert("請填寫圖片簡述");

        if (!user) {
            router.push("/login");
            return;
        }

        // 使用者若沒上傳圖片檔案 用預設值
        let uploadedPhotoURL= photoURL;

        if (file) {
            uploadedPhotoURL = await uploadImage();
        }

        const docRef = doc(db, "environment", facilityId as string);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return;

        const data = snapshot.data();
        const images = data.images || [];
        images[Number(imageIndex)] = {
        ...images[Number(imageIndex)],
        title: newTitle,
        url: uploadedPhotoURL,
    };

    await updateDoc(docRef, { images });
        alert("更新成功！");
        router.back();
    };

    useEffect(() => {
        const fetchImage = async () => {
                const docRef = doc(db, "environment", facilityId as string);
                const snapshot = await getDoc(docRef);
                if (!snapshot.exists()) return;

                const data = snapshot.data();
                const category = data.category;
                setCategory(category);

                const image = data.images?.[Number(imageIndex)];
                if (image) {
                    setNewTitle(image.title || "");
                    setPhotoURL(image.url || "");
                }
            setIsLoading(false);
        };

        fetchImage();
    }, [facilityId, imageIndex]);

  if (isLoading) return <LoadingSpinner/>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <p className="text-gray mb-4">
                <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-environment")}>環境介紹</span>
                / <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/frontend-environment/${facilityId}`)}>
                    {category} 
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


            <label className="mt-4 text-gray">圖片簡述：</label>
            <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 text-gray bg-white "
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
