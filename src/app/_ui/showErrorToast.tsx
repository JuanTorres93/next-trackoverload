import toast from 'react-hot-toast';

import AlertTriangle from './AlertTriangle';
import TextSmall from './typography/TextSmall';
import ButtonX from './ButtonX';

export function showErrorToast(message: string) {
  toast.custom((handledToast) => (
    <TextSmall
      className={`bg-error rounded-lg w-81.75 text-text-light px-4 py-4.75 grid grid-cols-[auto_1fr_auto] items-center gap-4 shadow-lg ${
        handledToast.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <AlertTriangle />

      <p className="font-medium leading-snug">{message}</p>

      <ButtonX
        onClick={() => toast.dismiss(handledToast.id)}
        className="ml-auto transition text-text-light! opacity-80 hover:opacity-100"
      />
    </TextSmall>
  ));
}
