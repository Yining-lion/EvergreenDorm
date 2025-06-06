"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type FAQ = {
    uid: string;
    category: string;
    descriptions: { question: string; answer: string }[];
};
export default function useFetchFAQ() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const q = query(collection(db, "faq"), orderBy("createdAt", "asc"));
            const querySnapshot = await getDocs(q);
            const fetchedData: FAQ[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedData.push({
                    uid: doc.id,
                    category: data.category,
                    descriptions: data.descriptions,
                });
            });

            setFaqs(fetchedData);
            setLoading(false);
        }

        fetchData();
    }, []);

    return { faqs, loading }
}

