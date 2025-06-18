"use client";

import { ReactNode } from "react";
import FadeInSection from "./FadeInSection";

export default function CatWrapper ({ children }: { children: ReactNode }) {
    return (
        <div className="bg-primary-pink flex-grow min-h-[700px]">
            <FadeInSection delay={0.2}>
                <div className="relative w-[350px] xs:w-[400px] mx-auto z-0">
                    {/* 臉 */}
                    <img src="/icons/cat/face.svg" className="absolute top-12  xs:top-8 left-1/2 -translate-x-1/2 z-1 w-45 xs:w-50" />

                    {/* 眼睛 */}
                    <div className="absolute top-29 xs:top-28 left-28 xs:left-32 z-2 w-14 xs:w-15">
                        <img src="/icons/cat/left-eye.svg" className="absolute" />
                        <img src="/icons/cat/pupil.svg" className="absolute pupil left-5 xs:left-6 top-1 w-4.5 xs:w-5" />
                    </div>
                    <div className="absolute top-29 xs:top-28 right-28 xs:right-32 z-2 w-14 xs:w-15">
                        <img src="/icons/cat/right-eye.svg" className="absolute" />
                        <img src="/icons/cat/pupil.svg" className="absolute pupil right-5 xs:right-6 top-1 w-4.5 xs:w-5" />
                    </div>

                    {/* 身體 */}
                    <img src="/icons/cat/body.svg" className="absolute top-40 left-1/2 -translate-x-1/2 z-0 w-70 h-92 xs:h-100" />

                    {/* 手 */}
                    <img src="/icons/cat/hand.svg" className="absolute top-68 left-0 z-3 w-14 xs:w-16" />
                    <img src="/icons/cat/hand.svg" className="absolute top-68 right-0 z-3 w-14 xs:w-16" />

                    {/* 腳 */}
                    <img src="/icons/cat/foot.svg" className="absolute -bottom-45 left-2 z-3 w-27 xs:w-30" />
                    <img src="/icons/cat/foot.svg" className="absolute -bottom-45 right-2 z-3 w-27 xs:w-30" />

                    {/* 登入框 */}
                    <div className="relative w-[300px] xs:w-[350px] h-[320px] m-auto z-2 bg-white p-6 top-40 text-gray">
                        {children}
                    </div>
                </div>
            </FadeInSection>
        </div>
    )
}