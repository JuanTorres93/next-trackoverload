import { FaBarcode } from 'react-icons/fa6';

import { disabledStyle } from '@/app/_ui/ButtonSearch';

function ScanButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`p-2 rounded-md cursor-pointer bg-primary-light text-text-light ${disabledStyle}`}
      {...props}
    >
      <FaBarcode size={20} />
    </button>
  );
}

export default ScanButton;
