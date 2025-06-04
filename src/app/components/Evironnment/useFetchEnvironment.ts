"use client";


import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type Facility = {
    uid: string;
    title: string;
    description: string;
    images: { title: string; url: string }[];
};

export default function useFetchEnvironment() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, "environment"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(q);
            const fetchedData: Facility[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedData.push({
                    uid: doc.id,
                    title: data.category,
                    description: data.description,
                    images: data.images || [],
                });
            });

            setFacilities(fetchedData);
            setLoading(false);
        }

        fetchData();
    }, []);

    return { facilities, loading }
}

