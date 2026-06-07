import { twMerge } from "tailwind-merge";

import ButtonBatchLogging from "@/app/_ui/buttons/ButtonBatchLogging";
import ButtonPlus from "@/app/_ui/buttons/ButtonPlus";
import PopupMenu, { PopupMenuItem } from "@/app/_ui/menus/PopupMenu";

function MealsPopup({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <PopupMenu className={twMerge("", className)} {...rest}>
      {items.map((item) => (
        <PopupMenuItem key={item.text} icon={item.icon} text={item.text} />
      ))}
    </PopupMenu>
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
