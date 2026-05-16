import { HiMagnifyingGlass } from 'react-icons/hi2';

export const disabledStyle =
  'disabled:text-text-minor-emphasis disabled:border-text-text-text-minor-emphasis disabled:bg-surface-light disabled:cursor-not-allowed';

function ButtonSearch({
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-4 py-2 transition rounded-xl cursor-pointer select-none bg-primary text-text-light hover:bg-primary-light font-semibold text-sm ${disabledStyle}`}
      {...props}
    >
      <HiMagnifyingGlass className="text-base" />
      {children || 'Buscar'}
    </button>
  );
}

export default ButtonSearch;
