"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { Activity, ActivityImage } from "@/app/components/Activity/useFetchActivity";

export default function ActivityDetailPage() {
  const router = useRouter();
  const { activityId } = useParams();
  const [activity, setActivity] = useState<Activity | null>(null);

    const handleDeleteImage = async (index: number) => {
      if (!activity) return;
      const updatedImages = [...activity.images];
      const confirmDelete = confirm(`確定要刪除 ${activity.images[index].title}？`)
      if (!confirmDelete) return;
      
      updatedImages.splice(index, 1);
      await updateDoc(doc(db, "activity", activity.uid), {
          images: updatedImages
      });
      setActivity({ ...activity, images: updatedImages });
    };


  useEffect(() => {
    const fetchActivity = async () => {
        const docRef = doc(db, "activity", activityId as string);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as Omit<Activity, "uid">;
          setActivity({ uid: snapshot.id, ...data });
        }
      };
      fetchActivity();
    }, [activityId]);

    if (!activity) return <LoadingSpinner/>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* 導覽列 & 新增鈕 */}
      <div className="text-gray mb-4 w-full flex items-center justify-between">
        <p>
          <span className="cursor-pointer hover:underline" onClick={() => router.push("/admin/frontend-activity")}>活動影像</span>
          / {activity.category}
        </p>

        <img 
        src="/icons/admin/Joyent.svg" 
        alt="add" 
        className="size-12 cursor-pointer"
        onClick={() => router.push(`/admin/frontend-activity/${activity.uid}/add`)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {activity.images?.map((img: ActivityImage, index: number) => (
          <div key={index} className="relative h-52">

            <img src={img.url} alt={`img-${index}`} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 w-full bg-black/30 text-white text-center text-lg py-2 font-semibold z-10">
              {img.title}
            </div>

            {/* 編輯刪除鈕 */}
            <div className="flex justify-center items-center absolute top-2 right-2">
              <img src="/icons/admin/Edit.svg" alt="edit" className="size-8 cursor-pointer ml-2" onClick={() => router.push(`/admin/frontend-activity/${activity.uid}/edit/${index}`)}></img>
              <img src="/icons/admin/Delete.svg" alt="delete" className="size-8 cursor-pointer ml-2" onClick={() => handleDeleteImage(index)}></img>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
