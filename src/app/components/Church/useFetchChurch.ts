"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export type ChurchContent = {
    uid: string;
    title: string;
    description: string;
};

export type Sister = {
    uid: string;
    name: string;
    description: string;
    photoURL: string;
};

export function useFetchChurchContents() {
    const [churchContents, setChurchContents] = useState<ChurchContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
              async function fetchData() {
                  const q = query(collection(db, "churchContent"));
                  const querySnapshot = await getDocs(q);
                  const fetchedData: ChurchContent[] = [];
        
                  querySnapshot.forEach((doc) => {
                      const data = doc.data();
                      fetchedData.push({
                            uid: doc.id,
                            title: data.title,
                            description: data.description,
                      });
                  });
        
                  setChurchContents(fetchedData);
                  setLoading(false);
              }
        
              fetchData();
          }, []);

    return { churchContents, loading }
}

export function useFetchAboutSister() {
    const [sisters, setSisters] = useState<Sister[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
            async function fetchData() {
                const q = query(collection(db, "aboutSister"));
                const querySnapshot = await getDocs(q);
                const fetchedData: Sister[] = [];
        
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedData.push({
                        uid: doc.id,
                        name: data.category,
                        description: data.description,
                        photoURL: data.photoURL
                    });
                });
        
                setSisters(fetchedData);
                setLoading(false);
            }
        
            fetchData();
    }, []);

    return { sisters, loading }
}