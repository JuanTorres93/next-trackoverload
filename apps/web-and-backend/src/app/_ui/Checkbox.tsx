import React from "react";

import { HiOutlineCheck } from "react-icons/hi2";

function Checkbox({
  label,
  ...props
}: { label?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
    >
      {/* Real input hidden but accessible */}
      <input type="checkbox" className="sr-only peer" {...rest} />

      {/* Visual box */}
      <span
        className={`
          size-4.5
          rounded-sm
          border-2
          border-border
          text-text-light 
          flex items-center justify-center
          transition-all
          
          peer-checked:bg-secondary-app
          peer-checked:border-secondary-app
          peer-checked:[&>svg]:opacity-100
          peer-disabled:cursor-not-allowed
          peer-disabled:bg-text-minor-emphasis/50
          peer-disabled:border-border/50
        `}
      >
        <HiOutlineCheck size={10} strokeWidth={3} className="opacity-0" />
      </span>

      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export default Checkbox;
