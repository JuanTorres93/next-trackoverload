import { useState } from "react";

import { autoUpdate, useFloating } from "@floating-ui/react";

import { useOutsideClick } from "./useOutsideClick";

export function usePopupPlacement() {
  const [isOpen, setIsOpen] = useState(false);

  const outsideClickRef = useOutsideClick(() => setIsOpen(false));

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
    open: isOpen,
  });

  function togglePopup() {
    setIsOpen((prev) => !prev);
  }

  function floatingRef(node: HTMLElement | null) {
    refs.setFloating(node);
    outsideClickRef.current = node;
  }

  return {
    isOpen,
    togglePopup,
    referenceRef: refs.setReference,
    floatingStyles,
    floatingRef,
  };
}
