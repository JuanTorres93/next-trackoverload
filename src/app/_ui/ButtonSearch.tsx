import { HiMagnifyingGlass } from 'react-icons/hi2';

function ButtonSearch({
  children,
  ...props
}: React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className="flex items-center justify-center gap-2 px-2 py-2 transition bg-green-500 rounded-lg cursor-pointer select-none text-neutral-50 hover:bg-green-600 disabled:text-zinc-400 disabled:border-zinc-400 disabled:bg-zinc-100 disabled:cursor-not-allowed"
      {...props}
    >
      <HiMagnifyingGlass className="text-2xl" />
      {children || 'Buscar'}
    </button>
  );
}

export default ButtonSearch;
