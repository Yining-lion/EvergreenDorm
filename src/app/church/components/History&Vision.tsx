"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type ChurchContent = {
  title: string;
  description: string;
};

export default function HistoryVision() {
    const [churchContents, setChurchContents] = useState<ChurchContent[]>([]);

    useEffect(() => {
          async function fetchData() {
              const q = query(collection(db, "churchContent"));
              const querySnapshot = await getDocs(q);
              const fetchedData: ChurchContent[] = [];
    
              querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  fetchedData.push({
                      title: data.title,
                      description: data.description,
                  });
              });
    
              setChurchContents(fetchedData);
          }
    
          fetchData();
      }, []);

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