"use client";

import { useFetchChurchContents } from '@/app/components/Church/useFetchChurch';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function HistoryVision() {
    const { churchContents, loading } = useFetchChurchContents();

    if (loading) return <LoadingSpinner />

    return (
        <div className="bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col max-w-3xl mx-auto">
            {churchContents.map((churchContent) => (
                <div key={churchContent.title}>
                    <h1 className="text-xl mb-2 text-primary-green">{churchContent.title}</h1>
                    <hr className="border-t border-gray-400"></hr>
                    <p className="text-base py-5 whitespace-pre-line">{churchContent.description}</p>
                </div>
            ))}
        </div>
    );
}