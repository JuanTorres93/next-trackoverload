"use client";

import {
  ButtonHTMLAttributes,
  ReactElement,
  cloneElement,
  useCallback,
  useState,
} from "react";

type ToggleFormProps = {
  toggleButton: ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  children: ReactElement<{
    show: boolean;
    onClose: () => void;
  }>;
};

function ToggleForm({ toggleButton, children }: ToggleFormProps) {
  const [show, setShow] = useState(false);

  const onClose = useCallback(() => setShow(false), []);

  const toggleButtonWithProps = cloneElement(toggleButton, {
    onClick: () => setShow((prev) => !prev),
  });

  const formWithProps = cloneElement(children, {
    show,
    onClose,
  });

  return (
    <>
      {toggleButtonWithProps}

      {formWithProps}
    </>
  );
}

export default ToggleForm;
