import { FaBarcode } from 'react-icons/fa6';

import { disabledStyle } from '@/app/_ui/buttons/ButtonSearch';

function ScanButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`p-2.5 rounded-xl cursor-pointer border-2 border-primary text-primary hover:bg-primary/10 transition ${disabledStyle}`}
      {...props}
    >
      <FaBarcode size={18} />
    </button>
  );
}

export default ScanButton;
