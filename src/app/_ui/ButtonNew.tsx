import { HiPlus } from 'react-icons/hi2';

function ButtonNew({
  children,
  className,
  props,
}: {
  children?: React.ReactNode;
  className?: string;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
  return (
    // NOTE: group class allows to target child elements on parent hover
    <button
      className={`p-3 text-base font-medium text-green-600 transition border-2 border-green-600 rounded-md group hover:cursor-pointer hover:bg-green-600 hover:text-neutral-50 ${className}`}
      {...props}
    >
      <HiPlus className="inline mb-1 mr-2 transition-transform duration-500 stroke-1 group-hover:rotate-90" />
      {children || 'Nuevo'}
    </button>
  );
}

export default ButtonNew;
