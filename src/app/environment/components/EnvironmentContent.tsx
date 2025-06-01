"use client";

import SectionLayout from '@/app/components/SectionLayout';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Modal from '@/app/components/Modal';

type Facility = {
  title: string;
  description: string;
  images: { title: string; url: string }[];
};

export default function EnvironmentContent() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [currentFacility, setCurrentFacility] = useState<Facility | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const openModal = (facility: Facility, imageIndex: number) => {
        setCurrentFacility(facility);
        setCurrentImageIndex(imageIndex);
    };

    const closeModal = () => {
        setCurrentFacility(null);
        setCurrentImageIndex(0);
    };

    const showPrevImage = () => {
        if (!currentFacility) return;
        setCurrentImageIndex((prev) => (prev - 1 + currentFacility.images.length) % currentFacility.images.length);
    };

    const showNextImage = () => {
        if (!currentFacility) return;
        setCurrentImageIndex((prev) => (prev + 1) % currentFacility.images.length);
    };

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, "environment"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(q);
            const fetchedData: Facility[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedData.push({
                    title: data.category,
                    description: data.description,
                    images: data.images || [],
                });
            });

            setFacilities(fetchedData);
        }

        fetchData();
    }, []);

    return (
        <SectionLayout title="環境介紹">
            <section className="max-w-3xl mx-auto -mt-20 pb-20">
                <div className="space-y-8">
                    {facilities.map((item, index) => {
                        const imagePosition = index % 2 === 0 ? "left" : "right";
                        const imageUrl = item.images[0]?.url
                        return (
                            <div
                            key={index}
                            className="bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4"
                            >
                            {imagePosition === 'left' && (
                                <div className="relative w-full h-52 cursor-pointer">
                                    {/* <Image fill /> 代表「 absolute 絕對定位」填滿它的父層，所以父層要使用 relative */}
                                    <Image
                                        src={imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        onClick={() => openModal(item, 0)}
                                    />
                                </div>
                            )}
                            <div className="w-full text-left">
                                <h3 className="text-xl mb-2">{item.title}</h3>
                                <hr className="border-t border-gray-300 mb-2" />
                                <p className="text">{item.description}</p>
                            </div>
                            {imagePosition === 'right' && (
                                <div className="relative w-full h-52 cursor-pointer">
                                    <Image
                                        src={imageUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        onClick={() => openModal(item, 0)}
                                    />
                                </div>
                            )}
                            </div>
                        )
                        
                    })}

                    <Modal isOpen={!!currentFacility} onClose={closeModal}>
                        {currentFacility && (
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
                                    src={currentFacility.images[currentImageIndex].url}
                                    alt={currentFacility.images[currentImageIndex].title}
                                    fill
                                    className="object-contain"
                                    />

                                    {/* 左上角張數指示 */}
                                    <div className="absolute top-4 left-4 text-white text-lg font-semibold z-11">
                                    {currentImageIndex + 1} / {currentFacility.images.length}
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

                                    {/* 下方標題遮罩 */}
                                    <div className="absolute bottom-0 left-0 w-full bg-black/30 p-6 text-white text-center text-xl font-semibold z-10">
                                    {currentFacility.images[currentImageIndex].title}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal>

                </div>
            </section>
        </SectionLayout>
    );
}
