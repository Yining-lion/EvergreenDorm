"use client";

import FacilityCard from "@/app/components/Evironnment/FacilityCard";
import useFetchEnvironment, { Facility } from "@/app/components/Evironnment/useFetchEnvironment";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "@/app/lib/firebase";


export default function FrontendEnvironment () {
    const { facilities: originalFacilities, loading } = useFetchEnvironment();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedFacilities, setEditedFacilities] = useState<Facility[]>([]);

    const handleEditing = (facility: Facility) => {
    setEditingId(facility.uid);
    setEditedFacilities([...originalFacilities]);
    };

    const handleChange = (facilityId: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedFacilities((prevFacilities) =>
            prevFacilities.map((facility) => {
                return facility.uid === facilityId ? { ...facility, [name]: value } : facility;
            })
        )
    }

    const displayFacilities = editingId ? editedFacilities : originalFacilities;

    const updateFacility = async (facilityId: string) => {
            const facility = editedFacilities.find((f) => f.uid === facilityId);
            if (!facility) return;
    
            const docRef = doc(db, "environment", facilityId)
      
            await updateDoc(docRef, {
                category: facility.category,
                description: facility.description,
                images: facility.images,
                updatedAt: new Date()
            });
            
            alert("更新成功！");
            setEditingId(null);
        }

    if (loading) return <LoadingSpinner/>

    return (
        <section className="max-w-3xl mx-auto">
            <FacilityCard 
            facilities={displayFacilities} 
            onEdit={handleEditing}
            onChange={handleChange}
            editingId={editingId}
            updateFacility={updateFacility}
            />
        </section>
        
    )
}