"use client";

import {
  ButtonHTMLAttributes,
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

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
  toggleButton,
  children,
}: {
  children?: React.ReactNode;
  toggleButton: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [show, setShow] = useState(false);
  const onClose = useCallback(() => setShow(false), []);

  const toggleButtonWithProps = cloneElement(
    toggleButton as React.ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>,
    {
      onClick: () => setShow((prev) => !prev),
    },
  );

  return (
    <ToggleFormContext.Provider value={{ show, onClose }}>
      {toggleButtonWithProps}

      {children}
    </ToggleFormContext.Provider>
  );
}

export default ToggleForm;
