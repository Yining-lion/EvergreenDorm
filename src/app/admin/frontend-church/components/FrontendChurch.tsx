"use client";

import { useRouter } from "next/navigation";

export default function FrontendChurch () {
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto p-4">
            <div className="bg-white w-full">
                <table className="w-full text-gray-700 text-center ">
                    <tbody>
                        <tr key="緣起與願景" className="h-12 hover:bg-green-50">                          
                            <td className="border-t border-admin-gray">
                                <p
                                className="cursor-pointer"
                                onClick={() => router.push(`/admin/frontend-church/churchContent`)}
                                >緣起與願景
                                </p>
                            </td>
                        </tr>
                        <tr key="關於修女" className="h-12 hover:bg-green-50">                          
                            <td className="border-t border-admin-gray">
                                <p
                                className="cursor-pointer"
                                onClick={() => router.push(`/admin/frontend-church/aboutSister`)}
                                >關於修女
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}