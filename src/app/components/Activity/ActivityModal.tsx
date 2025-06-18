// components/environment/FacilityModal.tsx
import Image from "next/image";
import Modal from "@/app/components/Modal";
import { Activity } from '@/app/components/Activity/useFetchActivity';
import { AnimatePresence, motion } from "framer-motion";

type Props  = {
  activity: Activity | null;
  currentImageIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ActivityModal({
  activity,
  currentImageIndex,
  onClose,
  onNext,
  onPrev,
}: Props) {
  if (!activity) return null;

  const image = activity.images[currentImageIndex];

  return (
    <Modal isOpen={!!activity} onClose={onClose}>
        <div className="relative w-full h-full flex justify-center items-center">

            {/* 左右半屏點擊區 (透明，負責切換) */}
            <div onClick={onPrev} className="absolute left-0 top-0 h-full w-1/2 cursor-pointer z-10" />
            <div onClick={onNext} className="absolute right-0 top-0 h-full w-1/2 cursor-pointer z-10" />

            {/* 圖片區 */}
            <div className="relative w-full h-full">
                <AnimatePresence>
                    <motion.div
                    key={image.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                    >
                    <Image
                        src={image.url}
                        alt={image.title}
                        fill
                        className="object-contain"
                    />
                    </motion.div>
                </AnimatePresence>

                {/* 左上角張數 */}
                <div className="absolute top-4 left-4 text-white text-lg font-semibold z-11">
                    {currentImageIndex + 1} / {activity.images.length}
                </div>

                {/* 左箭頭 */}
                <button
                    onClick={onPrev}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 cursor-pointer z-10"
                >
                    ←
                </button>

                {/* 右箭頭 */}
                <button
                    onClick={onNext}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 cursor-pointer z-10"
                >
                    →
                </button>

                {/* 下方標題遮罩 */}
                <div className="absolute bottom-0 left-0 w-full bg-black/30 p-6 text-white text-center text-xl font-semibold z-10">
                    {image.title}
                </div>
            </div>
        </div>
    </Modal>
  );
}
