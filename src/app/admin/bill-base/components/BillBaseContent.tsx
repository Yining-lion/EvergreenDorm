"use client";

import { getDocs, updateDoc, collection, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import InitialExcelExportButton from "./InitialExcelExportButton";

type BillBase = {
    uid: string;
    "B-rate": number;
    "C-rate": number;
    "base-rate": number;
    "water-rate": number;
};

export default function BillBaseContent() {
    const [billBase, setBillBase] = useState<BillBase[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBillBase((prev) => ({
            ...prev,
            [name]: parseFloat(value),
        }));
    };

    const updateBillBase = async () => {
        if (billBase.length === 0) return;
        const item = billBase[0];
        await updateDoc(doc(db, "billBase", item.uid), {
            ...billBase,
            createdAt: new Date(),
        });
        alert("更新成功！");
    };

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDocs(collection(db, "billBase"));
            const data = snapshot.docs.map((doc) => {
                const rawData = doc.data() as Omit<BillBase, "uid">;
                return {
                    uid: doc.id,
                    ...rawData,
                };
            });
            setBillBase(data);
        };
        fetchData();
    }, []);

    return (
    <div className="flex flex-col">
        <div className="flex items-end">
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center">
                    <thead>
                        <tr className="h-12">
                            <th>一度金額B</th>
                            <th>一度金額C</th>
                            <th>基本收費</th>
                            <th>水費</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billBase.map((item) => (
                            <tr key={item.uid} className="h-12">
                                <td className="border-t border-admin-gray">
                                {isEditing ? (
                                    <input
                                    type="number"
                                    name="B-rate"
                                    value={item["B-rate"]}
                                    className="bg-admin-gray text-center"
                                    onChange={handleChange}
                                    />
                                ) : (
                                    item["B-rate"]
                                )}
                                </td>
                                <td className="border-t border-admin-gray">
                                {isEditing ? (
                                    <input
                                    type="number"
                                    name="C-rate"
                                    value={item["C-rate"]}
                                    className="bg-admin-gray text-center"
                                    onChange={handleChange}
                                    />
                                ) : (
                                    item["C-rate"]
                                )}
                                </td>
                                <td className="border-t border-admin-gray">
                                {isEditing ? (
                                    <input
                                    type="number"
                                    name="base-rate"
                                    value={item["base-rate"]}
                                    className="bg-admin-gray text-center"
                                    onChange={handleChange}
                                    required
                                    />
                                ) : (
                                    item["base-rate"]
                                )}
                                </td>
                                <td className="border-t border-admin-gray">
                                {isEditing ? (
                                    <input
                                    type="number"
                                    name="water-rate"
                                    value={item["water-rate"]}
                                    className="bg-admin-gray text-center"
                                    onChange={handleChange}
                                    required
                                    />
                                ) : (
                                    item["water-rate"]
                                )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isEditing ? (
            <img
                src="/icons/admin/Check.svg"
                alt="check"
                className="size-10 cursor-pointer ml-2"
                onClick={async () => {
                await updateBillBase();
                setIsEditing(false);
                }}
            />
            ) : (
            <img
                src="/icons/admin/Edit.svg"
                alt="edit"
                className="size-10 cursor-pointer ml-2"
                onClick={() => setIsEditing(true)}
            />
            )}
        </div>
        

        <div className="mt-10">
            <InitialExcelExportButton />
        </div>
            
    </div>
    );
}
