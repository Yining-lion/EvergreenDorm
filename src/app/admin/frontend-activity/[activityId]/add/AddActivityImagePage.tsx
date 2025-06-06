"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage, auth } from "@/app/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { handleImageChange } from "@/app/lib/handleImageChange";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function AddActivityImagePage() {
  const router = useRouter();
  const { activityId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<string>();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      const docRef = doc(db, "activity", activityId as string);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setCategory(snapshot.data().category);
      }
      setIsLoading(false);
    };
    fetchCategory();
  }, [activityId]);

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
    if (!title || !category) {
        alert("請填寫完整資訊");
        return;
    }
    if (!auth.currentUser) return;

    // 上傳圖片
    const fileName = `${Date.now()}.jpg`;
    const storageRef = ref(storage, `activity/${category}/${fileName}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // 將圖片資料加入 Firestore
    const docRef = doc(db, "activity", activityId as string);
    const snapshot = await getDoc(docRef);
    const data = snapshot.data();
    const existingImages = data?.images || [];

    const newImage = { title, url: downloadURL };
    const updatedImages = [...existingImages, newImage];

    await updateDoc(docRef, { images: updatedImages });

    alert("新增成功！");
    router.back();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-gray mb-4">
        <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-activity")}>
          新增影像
        </span>
        / <span className="cursor-pointer hover:underline" onClick={() => router.push(`/admin/frontend-activity/${activityId}`)}>
          {category}
        </span> / 新增
      </p>

      <div className="flex flex-col items-start gap-4">
        {previewURL && (
          <img src={previewURL} alt="preview" className="w-64 h-64 object-cover bg-gray-200" />
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
        />
        <label className="mt-4 text-gray">圖片簡述：</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 text-gray bg-white"
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
