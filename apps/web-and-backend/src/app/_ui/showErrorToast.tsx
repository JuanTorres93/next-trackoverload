import toast from "react-hot-toast";

import AlertTriangle from "./AlertTriangle";
import ButtonX from "./buttons/ButtonX";
import TextSmall from "./typography/TextSmall";

export function showErrorToast(message: string) {
  toast.custom((handledToast) => (
    <TextSmall
      className={`bg-surface-card border-l-4 border-l-error rounded-xl w-81.75 text-text px-4 py-3.5 grid grid-cols-[auto_1fr_auto] items-center gap-3 shadow-lg ${
        handledToast.visible ? "animate-enter" : "animate-leave"
      }`}
    >
      <AlertTriangle />

      <p className="font-medium leading-snug text-error">{message}</p>

      <ButtonX
        onClick={() => toast.dismiss(handledToast.id)}
        className="ml-auto transition"
      />
    </TextSmall>
  ));
}
