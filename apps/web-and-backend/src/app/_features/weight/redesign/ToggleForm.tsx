"use client";

import { createContext, useCallback, useContext, useState } from "react";

import { twMerge } from "tailwind-merge";

import ButtonActionWhite from "@/app/_ui/buttons/ButtonActionWhite";

type ToggleFormContextValue = {
  show: boolean;
  onClose: () => void;
};

export const ToggleFormContext = createContext<ToggleFormContextValue>({
  show: false,
  onClose: () => {},
});

export function useToggleForm() {
  return useContext(ToggleFormContext);
}

function ToggleForm({
  children,
  label,
  ...props
}: {
  children?: React.ReactNode;
  label: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const [show, setShow] = useState(false);
  const onClose = useCallback(() => setShow(false), []);

  return (
    <ToggleFormContext.Provider value={{ show, onClose }}>
      <ButtonActionWhite
        className={twMerge("text-secondary-app", className)}
        onClick={() => setShow((prev) => !prev)}
        {...rest}
      >
        {label}
      </ButtonActionWhite>

      {children}
    </ToggleFormContext.Provider>
  );
}

export default ToggleForm;
