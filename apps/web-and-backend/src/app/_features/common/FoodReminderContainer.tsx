"use client";

import { useRouter } from "next/navigation";

import { HiArrowPath } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import ButtonX from "@/app/_ui/buttons/ButtonX";

import LoadingOverlay from "./LoadingOverlay";

function FoodReminderContainer({
  children,
  isEaten,
  onDelete,
  isDeleting,
  ...props
}: {
  isEaten?: boolean;
  onDelete?: () => Promise<void>;
  isDeleting?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const router = useRouter();

  async function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (!onDelete) return;

    await onDelete();

    router.refresh();
  }

  return (
    <div
      {...rest}
      className={twMerge(
        "bg-surface-card relative grid grid-cols-[1fr_min-content] gap-4 grid-rows-1! shadow-sm p-2 rounded-xl overflow-hidden hover:scale-[1.02] cursor-pointer transition",
        isEaten && "bg-primary! text-text-light shadow-xs! scale-[0.97]!",
        className,
      )}
    >
      {isDeleting && <LoadingOverlay />}

      {children}

      <ButtonX
        type="button"
        aria-label="Cambiar comida"
        data-testid="delete-food-button"
        className={twMerge(isEaten && "text-text-light!  hover:text-error!")}
        onClick={handleDelete}
      >
        <HiArrowPath className="w-6 h-6" />
      </ButtonX>
    </div>
  );
}

export default FoodReminderContainer;
