"use client";

import SectionLayout from "@/app/components/SectionLayout";
import { useState } from "react";
import useFetchActivity, { Activity } from "@/app/components/Activity/useFetchActivity";
import ActivityModal from "@/app/components/Activity/ActivityModal";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function ActivityContent() {
   const { activities, loading } = useFetchActivity();
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

    if (loading) return <LoadingSpinner/>

    return (
        <SectionLayout title="活動影像">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto -mt-7 w-[90%] md:w-full">
                {activities.map((activity, index) => (
                    <div
                    key={index}
                    className="group bg-white p-4 transition-all duration-200 shadow-[var(--shadow-black)] rounded-lg cursor-pointer
                            hover:shadow-[var(--shadow-primary-green)] open:shadow-[var(--shadow-primary-green)]"
                    onClick={ () => openModal(activity, 0) }
                    >
                        <p className="text-lg font-medium flex items-center">{activity.category}</p>
                    </div> 
                ))}
            </div>

            <ActivityModal
            activity={currentActivity}
            currentImageIndex={currentImageIndex}
            onClose={closeModal}
            onNext={showNextImage}
            onPrev={showPrevImage}
            />
        </SectionLayout>
    );
}