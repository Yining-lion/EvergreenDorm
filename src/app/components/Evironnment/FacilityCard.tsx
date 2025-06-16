import Image from "next/image";
import { Facility } from "./useFetchEnvironment";
import { useRouter } from "next/navigation";

type Props = {
  facilities: Facility[];
  onOpen?: (facility: Facility, imageIndex: number) => void;
  onEdit?: (facility: Facility) => void;
  onChange?: (facilityId: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editingId?: string | null;
  updateFacility?: (facilityId: string) => void;
};

export default function FacilityCard({ facilities, onOpen, onEdit,  onChange, editingId, updateFacility}: Props) {
    const router = useRouter();
    if (!facilities || facilities.length === 0) return null;
  
    return (
        <div className="space-y-8 text-gray">
            {facilities.map((facility, index) => {
                const imagePosition = index % 2 === 0 ? "left" : "right";
                const imageUrl = facility.images[0]?.url
                const isEditing = editingId === facility.uid;
                return (
                    <div className="flex" key={facility.uid}>
                        <div
                        className={`bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col w-full items-center md:flex-row md:items-start md:justify-between gap-4
                                    ${imagePosition === "left" ? "flex-col" : "flex-col-reverse"}`}
                        >
                        {imagePosition === "left" && (
                            <div className="relative w-full md:w-1/2 h-52 cursor-pointer">
                                {/* <Image fill /> 代表「 absolute 絕對定位」填滿它的父層，所以父層要使用 relative */}
                                <Image
                                    src={imageUrl}
                                    alt={facility.category}
                                    fill
                                    className="object-cover"
                                    onClick={() => {
                                        if (onOpen) {
                                            onOpen(facility, 0);
                                        } else {
                                            router.push(`/admin/frontend-environment/${facility.uid}`);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <div className="w-full md:w-1/2 text-left relative">
                            { isEditing ? 
                            (<input 
                                name="category"
                                value={facility.category}
                                className="bg-admin-gray w-full text-xl px-2"
                                onChange={(e) => onChange?.(facility.uid, e)}
                                required
                            />) : 
                            (<h3 className="text-xl mb-2">{facility.category}</h3>)
                            }
                            
                            <hr className="border-t border-gray-300 mb-2" />

                            { isEditing ? 
                            (<textarea
                                name="description"
                                value={facility.description}
                                className="bg-admin-gray w-full h-40 resize-none p-2"
                                onChange={(e) => onChange?.(facility.uid, e)}
                                required
                            />) : 
                            (<p className="text">{facility.description}</p>)
                            }

                        </div>
                        {imagePosition === "right" && (
                            <div className="relative w-full md:w-1/2 h-52 cursor-pointer">
                                <Image
                                    src={imageUrl}
                                    alt={facility.category}
                                    fill
                                    className="object-cover"
                                    onClick={() => {
                                        if (onOpen) {
                                            onOpen(facility, 0);
                                        } else {
                                            router.push(`/admin/frontend-environment/${facility.uid}`);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        </div>
                        { onEdit && 
                            (isEditing ?
                                (<img 
                                src="/icons/admin/Check.svg" 
                                alt="check" 
                                className="size-10 cursor-pointer ml-2" 
                                onClick={ async () => {
                                    await updateFacility?.(facility.uid);
                                    }}>
                                </img>) :
                                (<img src="/icons/admin/Edit.svg" alt="edit" className="size-7 cursor-pointer ml-2" onClick={() => onEdit?.(facility)}></img>)
                            )
                        }
                    </div>
                )
                
            })}
        </div>
    );
}
