"use client";

import { ReactNode } from "react";

export default function CatWrapper ({ children }: { children: ReactNode }) {
    return (
        <div className="bg-primary-pink">
            <div className="relative w-[400px] mx-auto">
                {/* 臉 */}
                <img src="/icons/cat/face.svg" className="absolute top-10 left-1/2 -translate-x-1/2 z-1 w-50" />

                {/* 眼睛 */}
                <div className="absolute top-28 left-32 z-2 w-15">
                    <img src="/icons/cat/left-eye.svg" className="absolute" />
                    <img src="/icons/cat/pupil.svg" className="absolute pupil left-6 top-1 w-5" />
                </div>
                <div className="absolute top-28 right-32 z-2 w-15">
                    <img src="/icons/cat/right-eye.svg" className="absolute" />
                    <img src="/icons/cat/pupil.svg" className="absolute pupil right-6 top-1 w-5" />
                </div>

                {/* 身體 */}
                <img src="/icons/cat/body.svg" className="absolute top-40 left-1/2 -translate-x-1/2 z-0 w-70 h-100" />

                {/* 手 */}
                <img src="/icons/cat/hand.svg" className="absolute top-68 left-0 z-3 w-16" />
                <img src="/icons/cat/hand.svg" className="absolute top-68 right-0 z-3 w-16" />

                {/* 腳 */}
                <img src="/icons/cat/foot.svg" className="absolute -bottom-45 left-2 z-3 w-30" />
                <img src="/icons/cat/foot.svg" className="absolute -bottom-45 right-2 z-3 w-30" />

                {/* 登入框 */}
                <div className="relative w-[350px] h-[320px] m-auto z-2 bg-white p-6 top-40 text-gray">
                    {children}
                </div>
            </div>
        </div>
        
    )
}