import React from "react";
import { cn } from "@/utils/cn";

interface PanelBodyProps {
  children: React.ReactNode;
  className?: string;
}

const PanelBody: React.FC<PanelBodyProps> = ({ children, className = "" }) => {
  return (
    <div
      className={cn("min-h-0 overflow-y-auto overscroll-contain", className)}
    >
      {children}
    </div>
  );
};

export default PanelBody;
