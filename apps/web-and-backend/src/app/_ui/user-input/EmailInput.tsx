import { HiOutlineEnvelope } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import BaseInputWithIcon from "./BaseInputWithIcon";

function EmailInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <BaseInputWithIcon
      className={twMerge("", className)}
      icon={<HiOutlineEnvelope className="" size={20} />}
      {...rest}
    />
  );
}

export default EmailInput;
