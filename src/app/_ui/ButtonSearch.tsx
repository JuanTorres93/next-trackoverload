import { HiMagnifyingGlass } from 'react-icons/hi2';

function ButtonSearch({
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className="flex items-center justify-center gap-2 px-2 py-2 transition rounded-lg cursor-pointer select-none bg-primary text-text-light hover:bg-primary-light disabled:text-text-minor-emphasis disabled:border-text-text-text-minor-emphasis disabled:bg-surface-light disabled:cursor-not-allowed"
      {...props}
    >
      <HiMagnifyingGlass className="text-2xl" />
      {children || 'Buscar'}
    </button>
  );
}

export default ButtonSearch;
