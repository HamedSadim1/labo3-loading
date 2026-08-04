import React from "react";

interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label" | "type"
> {
  label: string;
  active?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  label,
  active = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      type="button"
      aria-label={label}
      className={`group min-h-11 min-w-11 rounded-xl border border-white/15 bg-white/10 p-2.5 text-white/80 transition duration-200 hover:bg-white/20 hover:text-white focus:outline-none brand-focus active:scale-[0.97] sm:p-3 ${active ? "bg-white/20 text-white" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
