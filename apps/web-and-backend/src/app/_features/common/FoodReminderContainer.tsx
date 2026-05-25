"use client";
import { HiArrowPath } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import Modal from "../../_ui/Modal";

function FoodReminderContainer({
  children,
  isEaten,
  ...props
}: {
  isEaten?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <Modal>
      <div
        {...rest}
        className={twMerge(
          "bg-surface-card relative grid grid-cols-[1fr_min-content] gap-4 grid-rows-1! shadow-sm p-2 rounded-xl overflow-hidden hover:scale-[1.02] cursor-pointer transition",
          isEaten && "bg-primary! text-text-light shadow-xs! scale-[0.97]!",
          className,
        )}
      >
        {children}

        {/* 
        <button
          type="button"
          aria-label="Cambiar comida"
          data-testid="replace-food-button"
          className={twMerge(
            "flex items-center cursor-pointer gap-1 text-xs opacity-60 hover:text-primary! transition-colors",
            isEaten && "hover:opacity-80 hover:text-text-light!",
          )}
        >
          <HiArrowPath className="w-6 h-6" />
        </button>
            */}
      </div>
    </Modal>
  );
}

export default FoodReminderContainer;
