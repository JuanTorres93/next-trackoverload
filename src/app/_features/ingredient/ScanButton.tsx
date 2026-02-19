import { HtmlHTMLAttributes } from 'react';
import { FaBarcode } from 'react-icons/fa6';

function ScanButton({ ...props }: HtmlHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="p-2 rounded-md cursor-pointer bg-primary-light text-text-light"
      {...props}
    >
      <FaBarcode size={20} />
    </button>
  );
}

export default ScanButton;
