"use client";

import Image from 'next/image';

export default function AboutSister() {
    const sisters = [
    {
      name: '修女A',
      description: '修女A.....',
      imagePosition: 'left',
    },
    {
      name: '修女B',
      description: '修女B.....',
      imagePosition: 'right',
    },
    {
      name: '修女C',
      description: '修女C.....',
      imagePosition: 'left',
    },
  ];

  return (  
    <div className="space-y-8 max-w-3xl mx-auto">
        {sisters.map((item, index) => (
            <div
            key={index}
            className="bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-4"
            >
            {item.imagePosition === 'left' && (
                <div className="relative w-2/5 h-64">
                    {/* <Image fill /> 代表「 absolute 絕對定位」填滿它的父層，所以父層要使用 relative */}
                    <Image
                        src="/images/宿舍封面01.png"
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="w-3/5 text-left">
                <h3 className="text-lg mb-2">{item.name}</h3>
                <hr className="border-t border-gray-300 mb-2" />
                <p className="text-sm">{item.description}</p>
            </div>
            {item.imagePosition === 'right' && (
                <div className="relative w-2/5 h-64">
                    <Image
                        src="/images/宿舍封面01.png"
                        alt={item.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            </div>
        ))}
    </div>
  );
}
