import { twMerge } from 'tailwind-merge';
import { HiMagnifyingGlass } from 'react-icons/hi2';

function SearchInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-input-background text-input-text',
        className,
      )}
    >
      <HiMagnifyingGlass className="text-text-minor-emphasis shrink-0" />
      <input
        type="search"
        className="w-full bg-transparent outline-none text-sm placeholder:text-text-minor-emphasis"
        {...props}
      />
    </div>
  );
}

export default SearchInput;
