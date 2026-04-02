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
    "relative inline-flex items-center justify-center rounded-3xl font-medium transition-all duration-200 focus:outline-none active:shadow-clay-active active:scale-95";
  
  const variantClasses =
    variant === "primary"
      ? "bg-pastel-blue text-slate-700 shadow-clay hover:bg-pastel-blue-hover"
      : "bg-pastel-purple text-slate-700 shadow-clay hover:bg-pastel-purple-hover";

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
