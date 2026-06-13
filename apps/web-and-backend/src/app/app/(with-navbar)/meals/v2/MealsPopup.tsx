"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

import { autoUpdate, useFloating } from "@floating-ui/react";
import { twMerge } from "tailwind-merge";

import ButtonBatchLogging from "@/app/_ui/buttons/ButtonBatchLogging";
import ButtonPlus from "@/app/_ui/buttons/ButtonPlus";
import PopupMenu, { PopupMenuItem } from "@/app/_ui/menus/PopupMenu";

function MealsPopup({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    whileElementsMounted: autoUpdate,
    placement: "bottom-end",
    open: isOpen,
  });

  function togglePopup() {
    setIsOpen((prev) => !prev);
  }

  return (
    <>
      <ButtonPlus ref={refs.setReference} onClick={togglePopup} />

      {isOpen &&
        createPortal(
          <PopupMenu
            ref={refs.setFloating}
            style={floatingStyles}
            className={twMerge("", className)}
            {...rest}
          >
            {items.map((item) => (
              <PopupMenuItem
                key={item.text}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </PopupMenu>,
          document.body,
        )}
    </>
  );
}

const items = [
  // {
  // icon: <ButtonPlus popupVariant />,
  // text: "Añadir reciente",
  // },
  {
    icon: <ButtonPlus popupVariant />,
    text: "Añadir comida",
  },
  {
    icon: <ButtonPlus popupVariant />,
    text: "Añadir comida rápida",
  },
  {
    icon: <ButtonBatchLogging popupVariant />,
    text: "Planificar comidas",
  },
];

export default MealsPopup;
