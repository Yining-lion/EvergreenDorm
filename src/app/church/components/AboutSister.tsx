"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Sister = {
  name: string;
  description: string;
  photoURL: string;
};

export default function AboutSister() {
  const [sisters, setSisters] = useState<Sister[]>([]);

  useEffect(() => {
            async function fetchData() {
                const q = query(collection(db, "aboutSister"));
                const querySnapshot = await getDocs(q);
                const fetchedData: Sister[] = [];
      
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedData.push({
                        name: data.category,
                        description: data.description,
                        photoURL: data.photoURL
                    });
                });
      
                setSisters(fetchedData);
            }
      
            fetchData();
  }, []);

  return (  
    <div className="space-y-8 max-w-3xl mx-auto">
      {sisters.map((sister, index) => {
        const imagePosition = index % 2 === 0 ? "left" : "right";
        return (
          <div
            key={index}
            className="bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4"
          >
            {imagePosition === "left" && (
              <div className="relative w-2/5 h-64">
                <Image
                  src={sister.photoURL}
                  alt={sister.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="w-3/5 text-left">
              <h3 className="text-lg mb-2">{sister.name}</h3>
              <hr className="border-t border-gray-300 mb-2" />
              <p className="">{sister.description}</p>
            </div>
            {imagePosition === "right" && (
              <div className="relative w-2/5 h-64">
                <Image
                  src={sister.photoURL}
                  alt={sister.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
