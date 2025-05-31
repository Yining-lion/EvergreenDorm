"use client";

import { useState } from 'react';
import SectionLayout from '@/app/components/SectionLayout';
import Image from 'next/image';
import Modal from '@/app/components/Modal';

const activityData = [
    { year: "2025年", image: "/images/宿舍封面01.png"},
    { year: "2024年", image: "/images/宿舍封面01.png"},
    { year: "2023年", image: "/images/宿舍封面01.png"},
    { year: "2022年", image: "/images/宿舍封面01.png"},
] as const;


export default function ActivityContent() {
    const [modalData, setModalData] = useState<{ year: string, image: string } | null>(null);

    const openModal = (activity: { year: string, image: string }) => {
        setModalData(activity)
    }

    const closeModal = () => {
        setModalData(null);
    };

    return (
    <SectionLayout title="活動影像">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto -mt-7">
          {activityData.map((activity, index) => (
            <div
            key={index}
            className="group bg-white rounded-lg p-4 transition-all duration-200 shadow-[var(--shadow-black)] 
                    hover:shadow-[var(--shadow-primary-green)] open:shadow-[var(--shadow-primary-green)]"
            onClick={ () => openModal(activity) }
            >
            <p className="cursor-pointer text-lg font-medium flex items-center">{activity.year}</p>
            </div> 
          ))}
        </div>

        <Modal isOpen={!!modalData} onClose={closeModal}>
            {modalData && (
            <div className="bg-white p-5">
                <div className="font-semibold text-xl mb-3">{modalData.year}</div>
                <div className="w-full h-96 relative">
                <Image
                    src={modalData.image}
                    alt={modalData.year}
                    fill
                    className="object-cover"
                />
                </div>
                
            </div>
            )}
        </Modal>
    </SectionLayout>
    );
}
