import { HiMagnifyingGlass } from 'react-icons/hi2';

function ButtonSearch({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className="flex items-center justify-center gap-2 px-2 py-2 transition bg-green-500 rounded-lg cursor-pointer select-none text-neutral-50 hover:bg-green-600"
      {...props}
    >
      <HiMagnifyingGlass className="text-2xl" />
      {children || 'Buscar'}
    </div>
  );
}

export default ButtonSearch;
