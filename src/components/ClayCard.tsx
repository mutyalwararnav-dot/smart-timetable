import React from "react";

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ClayCard({ children, className = "", ...props }: ClayCardProps) {
  return (
    <div
      className={`bg-slate-800 rounded-3xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
