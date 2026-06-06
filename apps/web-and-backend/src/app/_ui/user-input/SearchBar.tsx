import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import Input from "./Input";

function SearchBar({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "flex gap-2 px-3.75 items-center bg-white rounded-full border border-text-minor-emphasis-app/20 shadow-xs",
        className,
      )}
    >
      <HiMiniMagnifyingGlass className="" size={20} />
      <Input className="px-0 border-none rounded-none" {...rest} />
    </div>
  );
}

export default SearchBar;
