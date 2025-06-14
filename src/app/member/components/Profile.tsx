"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Buttons";
import { auth, db, storage } from "@/app/lib/firebase";
import { doc, setDoc, serverTimestamp, getDoc, getDocs, collection } from "firebase/firestore";
import { signOut } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { getMessaging, deleteToken } from "firebase/messaging";
import Modal from '@/app/components/Modal';

export default function Profile () {
    const router = useRouter();
    const user = auth.currentUser;

    const [formData, setFormData] = useState({
    name: "",
    roomNumber: "",
    school:"",
    grade:"",
    phone: "",
    email: "",
    lastFiveDigits: "",
    contractExpiration: "",
    photoURL: ""
    });

    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [allRooms, setAllRooms] = useState<string[]>([]);

    // 處理大頭貼變動
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // 檢查檔案類型
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(selectedFile.type)) {
            alert("只能上傳 JPEG 或 PNG 圖片格式");
            return;
        }

        // 檢查檔案大小
        const MAX_SIZE_MB = 2;
        const isTooLarge = selectedFile.size > MAX_SIZE_MB * 1024 * 1024; // selectedFile.size 傳的是 Byte，所以要再 × 1,024 × 1,024
        if (isTooLarge) {
            alert(`圖片不能超過 ${MAX_SIZE_MB} MB`);
            return;
        }
        setFile(selectedFile);
        const previewURL = URL.createObjectURL(selectedFile); // 產生一個暫時可用的本地預覽網址 // blob:http://.......
        setPhotoURL(previewURL);
        setShowAvatarModal(false);
    };

    // photoURL 改變時，清掉舊的 blob URL (previewURL)
    useEffect(() => {
        return () => {
            if (photoURL?.startsWith("blob:")) {
                URL.revokeObjectURL(photoURL);
            }
        };
    }, [photoURL]);

    const uploadAvatar = async () => {
        if (!file || !user) return null;
        // 上傳至 firebase storage
        const storageRef = ref(storage, `avatars/${user.uid}`);
        await uploadBytes(storageRef, file);
        // 下載圖片 URL
        const downloadURL = await getDownloadURL(storageRef);
        setPhotoURL(downloadURL);
        return downloadURL;
    };

    const deleteAvatar = async () => {
        if (!user) return;
        if (!photoURL) {
            alert("沒有可刪除的圖片")
            return;
        }
        
        const confirmDelete = confirm("確定要刪除？");
        if (!confirmDelete) return;

        const storageRef = ref(storage, `avatars/${user.uid}`);
        await deleteObject(storageRef);
        setPhotoURL(null);
        // 更新 Firestore 裡的 photoURL 欄位為空
        await setDoc(
            doc(db, "members", user.uid),
            { photoURL: "" },
            { merge: true } // 僅更新 photoURL 欄位，其他欄位保留不變
        );
        setShowAvatarModal(false);
    };

    // 處理文字變動
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {

        if (!user) {
            router.push("/login");
            return;
        }

        // 使用者若沒上傳圖片檔案
        let uploadedPhotoURL= photoURL;
        // 使用者有上傳圖片檔案
        if (file) {
            uploadedPhotoURL = await uploadAvatar();
        }

        try {
            await setDoc(doc(db, "members", user.uid), {
                uid: user.uid,
                email: user.email,
                name: formData.name,
                roomNumber: formData.roomNumber,
                school: formData.school,
                grade: formData.grade,
                phone: formData.phone,
                lastFiveDigits: formData.lastFiveDigits,
                contractExpiration: formData.contractExpiration,
                photoURL: uploadedPhotoURL || "",
                timestamp: serverTimestamp()
            });

        alert("會員資料已更新！");

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("提交失敗，請稍後再試！");
        }
    };

    const handleSignout = async () =>  {
        if (typeof window !== "undefined" && user) {
            try {
                const messaging = getMessaging();
                // 刪除裝置上的 FCM token
                await deleteToken(messaging);
                // 更新 Firestore 將 token 清除
                await setDoc(doc(db, "members", user.uid), {
                fcmToken: null,
                }, { merge: true });
                console.log("FCM token 已刪除");
            } catch (err) {
                console.error("刪除 FCM token 發生錯誤", err);
            }
        }

        await signOut(auth);
    }

    useEffect(() => {
        // 顯示已填寫之會員資料在畫面上
        const fetchData = async () => {
            if (!user) return;

            try {
                const memberSnapshot = await getDoc(doc(db, "members", user.uid))
                if (memberSnapshot.exists()) {
                    const data = memberSnapshot.data();
                    setFormData({
                        name: data.name || "",
                        roomNumber: data.roomNumber || "",
                        school: data.school || "",
                        grade: data.grade || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        lastFiveDigits: data.lastFiveDigits || "",
                        contractExpiration: data.contractExpiration || "",
                        photoURL: data.photoURL || "",
                    });
                    setPhotoURL(data.photoURL || null);
                } else {
                    console.log("找不到會員資料");
                }

                // 從 rooms (房型清單) 取得所有棟名+房號，以便居住房號的 option
                const roomsSnapshot = await getDocs(collection(db, "rooms"))
                const roomsData = roomsSnapshot.docs.map((doc) => doc.data())
                const allRooms = roomsData.flatMap(data => data.building + data.roomNumber)
                setAllRooms(allRooms)

            } catch (err) {
                console.error("讀取資料失敗", err);
            }    
        };
        fetchData();


    },[])

    return (
        <div className="bg-primary-pink">
            <div className="relative bg-white rounded-xs max-w-3xl mx-auto p-10 mt-10">
                {/* 大頭貼 */}
                <div className="relative size-32 mx-auto mb-10">
                    <img src={photoURL || "/icons/member/Headshot.svg"} className="size-32 object-cover rounded-full flex items-center justify-center opacity-80"></img>

                    <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                    >
                        <img src="/icons/member/Camera.svg"></img>
                    </button>

                    <Modal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)}>
                        <div className="p-6 text-center space-y-4">
                            <label className="block font-semibold text-gray hover:underline cursor-pointer">
                            上傳圖片
                                <input
                                    type="file"
                                    accept=".jpg, .jpeg, .png"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                            <button
                            className="text-red-500 font-semibold hover:underline cursor-pointer"
                            onClick={deleteAvatar}
                            >
                            刪除圖片
                            </button>
                        </div>
                    </Modal>
                </div>

                {/* 表單 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray">
                    <div>
                        <label className="block mb-1 text-lg">姓名</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">居住房號</label>
                        <select
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        >
                            <option value="">請選擇</option>
                            {allRooms.map((room, i) => (
                                <option key={i} value={room}>{room}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">學校科系</label>
                        <input
                        type="text"
                        name="school"
                        value={formData.school}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">年級</label>
                        <input
                        type="text"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">連絡電話</label>
                        <input
                        type="number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">電子信箱</label>
                        <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">匯款末五碼</label>
                        <input
                        type="number"
                        name="lastFiveDigits"
                        value={formData.lastFiveDigits}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-lg">合約到期日</label>
                        <input
                        type="date"
                        name="contractExpiration"
                        value={formData.contractExpiration}
                        onChange={handleChange}
                        className="w-full bg-primary-pink p-2 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-between mt-15">
                <Button 
                variant="gray" 
                onClick={handleSignout}>
                    登出
                </Button>
                <Button variant="brown" onClick={handleSubmit}>
                    更新
                </Button>
                </div>

            </div>
        </div>
    )
}