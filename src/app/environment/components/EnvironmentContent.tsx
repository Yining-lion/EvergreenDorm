"use client";

import SectionLayout from '@/app/components/SectionLayout';
import { useState } from 'react';
import useFetchEnvironment, { Facility } from '@/app/components/Evironnment/useFetchEnvironment';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import FacilityModal from '@/app/components/Evironnment/FacilityModal';
import FacilityCard from '@/app/components/Evironnment/FacilityCard';

export default function EnvironmentContent() {
    const { facilities, loading } = useFetchEnvironment();
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

   if (loading) return <LoadingSpinner/>

    
    return (
        <SectionLayout title="環境介紹">
            <section className="max-w-3xl mx-auto -mt-20 pb-20">
                <FacilityCard facilities={facilities} onOpen={openModal}/>

                <FacilityModal
                    facility={currentFacility}
                    currentImageIndex={currentImageIndex}
                    onClose={closeModal}
                    onNext={showNextImage}
                    onPrev={showPrevImage}
                />
            </section>
        </SectionLayout>
    );
}
