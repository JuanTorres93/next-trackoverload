"use client";

import { createPortal } from "react-dom";

import { twMerge } from "tailwind-merge";

import { usePopupPlacement } from "@/app/_hooks/usePopupPlacement";
import ButtonBatchLogging from "@/app/_ui/buttons/ButtonBatchLogging";
import ButtonPlus from "@/app/_ui/buttons/ButtonPlus";
import PopupMenu, { PopupMenuItem } from "@/app/_ui/menus/PopupMenu";

function MealsPopup({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { isOpen, togglePopup, referenceRef, floatingStyles, floatingRef } =
    usePopupPlacement();

  return (
    <>
      <ButtonPlus ref={referenceRef} onClick={togglePopup} />

      {isOpen &&
        createPortal(
          <PopupMenu
            ref={floatingRef}
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
