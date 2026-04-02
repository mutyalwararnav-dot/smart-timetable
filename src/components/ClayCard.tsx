import React from "react";

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ClayCard({ children, className = "", ...props }: ClayCardProps) {
  return (
    <div
      className={`bg-pastel-bg rounded-3xl shadow-clay p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
