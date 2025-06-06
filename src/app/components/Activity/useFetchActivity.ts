"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type Activity = {
    uid: string;
    category: string;
    images: ActivityImage[];
};

export type ActivityImage = {
  url: string;
  title: string;
}

export default function useFetchActivity() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            async function fetchData() {
                const q = query(collection(db, "activity"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const fetchedData: Activity[] = [];
    
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedData.push({
                        uid: doc.id,
                        category: data.category,
                        images: data.images || [],
                    });
                });
    
                setActivities(fetchedData);
                setLoading(false);
            }
    
            fetchData();
        }, []);

    return { activities, loading }
}

