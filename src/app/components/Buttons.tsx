"use client";

import React from "react";
import classNames from "classnames";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  variant?: "green" | "orange" | "brown" | "gray";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

// Record<K, V>
const variantClasses: Record<string, string> = {
  green: "bg-secondary-green text-white hover:bg-primary-green",
  orange: "bg-primary-orange text-primary-brown hover:bg-primary-brown hover:text-white",
  brown: "bg-primary-brown text-white transition-transform duration-200 hover:scale-105 w-[105px] sm:w-[130px] py-2",
  gray: "bg-gray text-white transition-transform duration-200 hover:scale-105 w-[105px] sm:w-[130px] py-2",
};

// 函數型元件 (Functional Component)
const Button: React.FC<ButtonProps> = ({ 
  children,
  onClick,
  className = "",
  type = "button",
  variant = "green",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(
        "cursor-pointer transition duration-500",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
