"use client";

import { useRouter } from "next/navigation";

import { MdOutlineArrowBack } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import ButtonCircle from "./ButtonCircle";

function ButtonBack({
  popupVariant = false,
  ...props
}: { popupVariant?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const router = useRouter();

  function handleGoBack() {
    router.back();
  }

  return (
    <ButtonCircle
      className={twMerge("", className)}
      popupVariant={popupVariant}
      onClick={handleGoBack}
      {...rest}
    >
      <MdOutlineArrowBack size={22} />
    </ButtonCircle>
  );
}

export default ButtonBack;
