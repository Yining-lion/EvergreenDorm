import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sister } from "./useFetchChurch";

type Props = {
  sisters: Sister[];
  onOpen?: boolean
  onEdit?: (sister: Sister) => void;
  onChange?: (sisterId: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDelete?: (sisterId: string, sisterName: string) => void;
  editingId?: string | null;
  updateSister?: (sisterId: string) => void;
};

export default function SisterCard({ sisters, onOpen, onEdit, onChange, onDelete, editingId, updateSister}: Props) {
    const router = useRouter();
    if (!sisters || sisters.length === 0) return null;
  
    return (
        <div className="space-y-8 max-w-3xl mx-auto text-gray">
            {sisters.map((sister, index) => {
                const imagePosition = index % 2 === 0 ? "left" : "right";
                const imageUrl = sister.photoURL
                const isEditing = editingId === sister.uid;
                return (
                    <div className="flex" key={sister.uid}>
                        <div
                        className="bg-white shadow-[var(--shadow-black)] rounded-xs p-4 flex flex-col w-full md:flex-row items-center md:items-start md:justify-between gap-4"
                        >
                        {imagePosition === 'left' && (
                            <div className={`relative w-full md:w-1/2 h-52 ${onOpen ? "cursor-pointer" : ""}`}>
                                {/* <Image fill /> 代表「 absolute 絕對定位」填滿它的父層，所以父層要使用 relative */}
                                <Image
                                    src={imageUrl}
                                    alt={sister.name}
                                    fill
                                    className="object-cover"
                                    onClick={() => {
                                        if (onOpen) {
                                            router.push(`/admin/frontend-church/aboutSister/edit/${sister.uid}`);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        <div className="w-full md:w-1/2 text-left relative">
                            { isEditing ? 
                            (<input 
                                name="name"
                                value={sister.name}
                                className="bg-admin-gray w-full text-xl px-2"
                                onChange={(e) => onChange?.(sister.uid, e)}
                                required
                            />) : 
                            (<h3 className="text-xl mb-2">{sister.name}</h3>)
                            }
                            
                            <hr className="border-t border-gray-300 mb-2" />

                            { isEditing ? 
                            (<textarea
                                name="description"
                                value={sister.description}
                                className="bg-admin-gray w-full h-40 resize-none p-2"
                                onChange={(e) => onChange?.(sister.uid, e)}
                                required
                            />) : 
                            (<p className="text">{sister.description}</p>)
                            }

                        </div>
                        {imagePosition === 'right' && (
                            <div className={`relative w-full md:w-1/2 h-52 ${onOpen ? "cursor-pointer" : ""}`}>
                                <Image
                                    src={imageUrl}
                                    alt={sister.name}
                                    fill
                                    className="object-cover"
                                    onClick={() => {
                                        if (onOpen) {
                                            router.push(`/admin/frontend-church/aboutSister/edit/${sister.uid}`);
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
                                    await updateSister?.(sister.uid);
                                    }}>
                                </img>) :
                                (<div className="flex flex-col items-center">
                                    <img src="/icons/admin/Edit.svg" alt="edit" className="size-8 cursor-pointer ml-2" onClick={() => onEdit?.(sister)}></img>
                                    <img src="/icons/admin/Delete.svg" alt="delete" className="size-8 cursor-pointer ml-2 mt-2" onClick={() => onDelete?.(sister.uid, sister.name)}></img>
                                </div>)
                            )
                        }
                    </div>
                )
                
            })}
        </div>
    );
}
