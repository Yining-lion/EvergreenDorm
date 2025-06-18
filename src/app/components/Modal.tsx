"use client";

import { ReactNode, MouseEvent } from "react";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  position?: "center" | "top";
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children, position = "center" }: ModalProps) {

    if (!isOpen) return null;

    const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                key="modal-overlay"
                className={classNames(
                    "fixed inset-0 z-50 bg-black/85",
                    position === "center" && "flex items-center justify-center"
                )}
                onClick={handleOverlayClick}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                >
                    <motion.div
                        key="modal-content"
                        className={classNames(
                        "relative w-full transform overflow-hidden transition-all duration-200",
                        position === "center" && "h-full max-h-screen p-0 flex flex-col justify-center items-center",
                        position === "top" && "bg-white"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                        onClick={onClose}
                        className={classNames(
                            "absolute font-bold top-4 right-4 cursor-pointer z-20",
                            position === "center" && "text-white hover:text-gray-300 text-2xl",
                            position === "top" && "text-gray-600 hover:text-black text-xl"
                        )}
                        >
                        ✕
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
