"use client";

import SectionLayout from '@/app/components/SectionLayout';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Modal from '@/app/components/Modal';

type Activity = {
  year: string;
  images: { title: string; url: string }[];
};

export default function ActivityContent() {
    const [activitys, setActivitys] = useState<Activity[]>([])
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const openModal = (activity: Activity, imageIndex: number) => {
        setCurrentActivity(activity);
        setCurrentImageIndex(imageIndex);
    };

    const closeModal = () => {
        setCurrentActivity(null);
        setCurrentImageIndex(0);
    };

    const showPrevImage = () => {
        if (!currentActivity) return;
        setCurrentImageIndex((prev) => (prev - 1 + currentActivity.images.length) % currentActivity.images.length);
    };

    const showNextImage = () => {
        if (!currentActivity) return;
        setCurrentImageIndex((prev) => (prev + 1) % currentActivity.images.length);
    };

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, "activity"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedData: Activity[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedData.push({
                    year: data.category,
                    images: data.images || [],
                });
            });

            setActivitys(fetchedData);
        }

        fetchData();
    }, []);

    return (
        <SectionLayout title="活動影像">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto -mt-7">
            {activitys.map((activity, index) => (
                <div
                key={index}
                className="group bg-white rounded-lg p-4 transition-all duration-200 shadow-[var(--shadow-black)] 
                        hover:shadow-[var(--shadow-primary-green)] open:shadow-[var(--shadow-primary-green)]"
                onClick={ () => openModal(activity, 0) }
                >
                <p className="cursor-pointer text-lg font-medium flex items-center">{activity.year}</p>
                </div> 
            ))}
            </div>

            <Modal isOpen={!!currentActivity} onClose={closeModal}>
                {currentActivity && (
                    <div className="relative w-full h-full flex justify-center items-center">

                        {/* 左右半屏點擊區 (透明，負責切換) */}
                        <div
                        onClick={showPrevImage}
                        className="absolute left-0 top-0 h-full w-1/2 cursor-pointer z-10"
                        />
                        <div
                        onClick={showNextImage}
                        className="absolute right-0 top-0 h-full w-1/2 cursor-pointer z-10"
                        />

                        {/* 圖片區 */}
                        <div className="relative w-full h-full">
                            <Image
                            src={currentActivity.images[currentImageIndex].url}
                            alt={currentActivity.images[currentImageIndex].title}
                            fill
                            className="object-contain"
                            />

                            {/* 左上角張數指示 */}
                            <div className="absolute top-4 left-4 text-white text-lg font-semibold z-11">
                            {currentImageIndex + 1} / {currentActivity.images.length}
                            </div>

                            {/* 左箭頭 */}
                            <button
                            onClick={showPrevImage}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 z-10 cursor-pointer"
                            >
                            ←
                            </button>

                            {/* 右箭頭 */}
                            <button
                            onClick={showNextImage}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 z-10 cursor-pointer"
                            >
                            →
                            </button>

                            {/* 下方標題 */}
                            <div className="absolute bottom-0 left-0 w-full bg-black/30 p-6 text-white text-center text-xl font-semibold z-10">
                            {currentActivity.images[currentImageIndex].title}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </SectionLayout>
    );
}
