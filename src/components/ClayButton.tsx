import React from "react";
import { Loader2 } from "lucide-react";

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export function ClayButton({
  children,
  className = "",
  variant = "primary",
  isLoading = false,
  ...props
}: ClayButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center rounded-3xl font-medium transition-all duration-200 focus:outline-none active:scale-95 shadow-md";
  
  const variantClasses =
    variant === "primary"
      ? "bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700"
      : "bg-slate-700 text-slate-100 hover:bg-slate-600 active:bg-slate-800";

  return (
    <button
      className={`${baseClasses} ${variantClasses} px-6 py-3 ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
}
