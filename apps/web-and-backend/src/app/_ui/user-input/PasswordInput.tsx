"use client";

import { useState } from "react";

import { LuLockKeyhole } from "react-icons/lu";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { twMerge } from "tailwind-merge";

import BaseInputWithIcon from "./BaseInputWithIcon";

function PasswordInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  const [showPassword, setShowPassword] = useState(false);

  const Icon = (
    <button
      type="button"
      className="cursor-pointer"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <TbEye size={22} /> : <TbEyeClosed size={22} />}
    </button>
  );

  return (
    <BaseInputWithIcon
      className={twMerge("", className)}
      icon={<LuLockKeyhole className="" size={20} />}
      iconAfter={Icon}
      type={showPassword ? "text" : "password"}
      placeholder="Introduce tu contraseña"
      {...rest}
    />
  );
}

export default PasswordInput;
