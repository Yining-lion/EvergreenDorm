"use client";

import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import useFetchActivity, { Activity } from "@/app/components/Activity/useFetchActivity";

export default function FrontendActivity () {
    const router = useRouter();
    const { activities: originalActivities, loading } = useFetchActivity();

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedActivities, setEditedActivities] = useState<Activity[]>([]);

    const handleChange = (activityId: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedActivities((prevActivities) =>
            prevActivities.map((activity) => {
                return activity.uid === activityId ? { ...activity, [name]: value } : activity;
            })
        )
    }

    const deleteActivity = async (activityId: string, activityName: string) => {
        const confirmDelete = confirm(`確定要刪除 ${activityName} ？`);
        if (!confirmDelete) return;
        try {
            await deleteDoc(doc(db, "activity", activityId));
            setEditedActivities(prevActivities => prevActivities.filter(activity => activity.uid !== activityId));
        }
        catch(err) {
            console.error("刪除失敗:", err);
        }
    }

    const updateActivity = async (activityId: string) => {
            const activity = editedActivities.find((a) => a.uid === activityId);
            if (!activity) return;
    
            const docRef = doc(db, "activity", activityId)
      
            await updateDoc(docRef, {
                category: activity.category,
                images: activity.images,
                updatedAt: new Date()
            });
            
            alert("更新成功！");
            setEditingId(null);
        }

    useEffect(() => {
        setEditedActivities(originalActivities)
    }, [originalActivities]);

    if (loading) return <LoadingSpinner/>

    return (
        <div className="max-w-3xl mx-auto p-4 flex flex-col items-end">
            <img 
            src="/icons/admin/Joyent.svg" 
            alt="add" 
            className="size-12 cursor-pointer mb-2 mr-5"
            onClick={() => router.push(`/admin/frontend-activity/add`)}
            />
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <tbody>
                        {editedActivities.map((activity) => {
                            const isRowEditing = editingId === activity.uid;
                    
                            return (
                                <tr key={activity.uid} className="h-12 hover:bg-green-50">
                                                                    
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<input 
                                            name="category"
                                            value={activity.category}
                                            className="bg-admin-gray text-center"
                                            onChange={(e) => handleChange(activity.uid, e)}
                                            required
                                        />):
                                        (<p
                                        className="cursor-pointer"
                                        onClick={() => router.push(`/admin/frontend-activity/${activity.uid}`)}
                                        >{activity.category}
                                        </p>)}
                                    </td>
                                    
                                    <td className="border-t border-admin-gray">
                                        {isRowEditing ?
                                        (<img 
                                            src="/icons/admin/Check.svg" 
                                            alt="check" 
                                            className="size-10 cursor-pointer mx-auto" 
                                            onClick={ async () => {
                                                await updateActivity(activity.uid);
                                                }}>
                                            </img>) :
                                        (<div className="flex justify-end items-center px-5">
                                            <img src="/icons/admin/Edit.svg" alt="edit" className="size-7 cursor-pointer ml-2" onClick={() => setEditingId(activity.uid)}></img>
                                            <img src="/icons/admin/Delete.svg" alt="delete" className="size-7 cursor-pointer ml-2" onClick={() => deleteActivity(activity.uid, activity.category)}></img>
                                        </div>)}
                                    </td>
                                </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
        
        
    )
}