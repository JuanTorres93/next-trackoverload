import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import BaseInputWithIcon from "./BaseInputWithIcon";

function SearchBar({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <BaseInputWithIcon
      className={twMerge("", className)}
      icon={<HiMiniMagnifyingGlass className="" size={20} />}
      {...rest}
    />
  );
}

export default SearchBar;
