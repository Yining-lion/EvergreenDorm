"use client";

import Button from "./Buttons";
import { navItems } from "../constants/navItems";
import Link from "next/link";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FadeInSection from "./FadeInSection";

const desktopImages = [
  "/images/宿舍封面01.png",
  "/images/宿舍封面02.png",
];
const mobileImages = [
  "/images/宿舍封面01.svg",
  "/images/宿舍封面02.svg",
];

const settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  fade: true,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  pauseOnHover: false,
};

export default function MainBanner() {

  // 偵測螢幕尺寸
  const isClient = typeof window !== "undefined";
  const initialWidth = isClient ? window.innerWidth : 1024;
  const [windowWidth, setWindowWidth] = useState<number | null>(initialWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowWidth === null) return null;

  // 根據螢幕寬度選擇圖片組
  const isDesktop = windowWidth >= 1024;

  const images = isDesktop ? desktopImages : mobileImages;

  return (
    <>
      <div className="h-[400px] relative overflow-hidden">
        <Slider {...settings}>
          {images.map((src, index) => (
            <div key={index}>
              <div
                className="h-[400px] bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            </div>
          ))}
        </Slider>
      </div>

      <FadeInSection delay={0.2}>
        <div className="mt-[-50px] w-[95%] flex justify-center mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-12 sm:gap-15">
            {navItems.map((item, index) => (
              <Link href={item.href} key={index}>
                <div
                  className={`
                    scale-90 xs:scale-105 sm:scale-110
                  `}
                >
                  <Button
                    variant="orange"
                    className="relative w-full h-[100px] sm:w-[200px] sm:h-[110px] shadow flex items-center justify-between px-4 group"
                  >
                    <div className="flex flex-col items-start justify-center w-2/3 mr-2">
                      <div className="text-xl sm:text-2xl font-bold">{item.label}</div>
                    </div>

                    <div className="absolute bottom-6 left-0 w-2/5 h-[3px] bg-primary-brown group-hover:bg-white transition duration-500" />

                    <div className="relative size-10 sm:size-12">
                      <img
                        src={item.icon}
                        alt={`${item.label} icon`}
                        className="absolute inset-0 transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                      />
                      <img
                        src={item.iconHover}
                        alt={`${item.label} icon hover`}
                        className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      />
                    </div>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </FadeInSection>
      
    </>
 
  )
}
