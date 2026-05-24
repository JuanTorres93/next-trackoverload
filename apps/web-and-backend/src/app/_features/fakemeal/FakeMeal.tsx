import { useState } from "react";

import { showErrorToast } from "@/app/_ui/showErrorToast";

import { FakeMealDTO } from "../../../application-layer/dtos/FakeMealDTO";
import ButtonX from "../../_ui/buttons/ButtonX";
import { formatToInteger } from "../../_utils/format/formatToInteger";
import LoadingOverlay from "../common/LoadingOverlay";
import { removeFakeMealFromDay } from "./actions";

function FakeMeal({
  fakeMeal,
  dayId,
  ...props
}: {
  fakeMeal: FakeMealDTO;
  dayId: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemoveFakeMeal() {
    setIsLoading(true);
    try {
      const jsend = await removeFakeMealFromDay(dayId, fakeMeal.id);
      if (jsend.status !== "success") {
        showErrorToast(
          jsend.data?.message ||
            "Error al eliminar la comida. Por favor, inténtalo de nuevo.",
        );
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-2.5 bg-surface-card ${className ?? ""}`}
      {...rest}
    >
      {isLoading && <LoadingOverlay />}

      <div className="flex items-center justify-center text-base rounded-full w-9 h-9 bg-surface-light shrink-0 text-text-minor-emphasis">
        ⚡
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-text">
          {fakeMeal.name}
        </p>

        <p className="text-xs text-text-minor-emphasis">
          {formatToInteger(fakeMeal.calories)} kcal ·{" "}
          {formatToInteger(fakeMeal.protein)} g prot
        </p>
      </div>

      <ButtonX data-testid="remove-fake-meal" onClick={handleRemoveFakeMeal} />
    </div>
  );
}

export default FakeMeal;
