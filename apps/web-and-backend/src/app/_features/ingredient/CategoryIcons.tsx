import { GiAlmond } from "react-icons/gi";
import {
  LuApple,
  LuCarrot,
  LuCircleHelp,
  LuFish,
  LuGlassWater,
  LuMilk,
  LuPill,
  LuSprout,
  LuWheat,
} from "react-icons/lu";
import { TbBottle, TbMeat } from "react-icons/tb";
import { IngredientDTO } from "shared";
import { twMerge } from "tailwind-merge";

const ICON_SIZE = 20;

function CategoryIcon(ingredient: IngredientDTO) {
  switch (ingredient.category) {
    case "vegetables":
      return <VegetablesIcon />;
    case "fruits":
      return <FruitsIcon />;
    case "meat":
      return <MeatIcon />;
    case "fish":
      return <FishIcon />;
    case "dairy":
      return <DairyIcon />;
    case "grains":
      return <GrainsIcon />;
    case "legumes":
      return <LegumesIcon />;
    case "nuts":
      return <NutsIcon />;
    case "fats":
      return <FatsIcon />;
    case "beverages":
      return <BeveragesIcon />;
    case "supplements":
      return <SupplementsIcon />;
    default:
      return <OtherCategoryIcon />;
  }
}

export default CategoryIcon;

function VegetablesIcon() {
  return (
    <BaseIcon
      className="text-green-700 bg-green-100"
      icon={<LuCarrot size={ICON_SIZE} />}
    />
  );
}

function FruitsIcon() {
  return (
    <BaseIcon
      className="text-rose-700 bg-rose-100"
      icon={<LuApple size={ICON_SIZE} />}
    />
  );
}

function MeatIcon() {
  return (
    <BaseIcon
      className="text-red-800 bg-red-100"
      icon={<TbMeat size={ICON_SIZE} />}
    />
  );
}

function FishIcon() {
  return (
    <BaseIcon
      className="text-sky-700 bg-sky-100"
      icon={<LuFish size={ICON_SIZE} />}
    />
  );
}

function DairyIcon() {
  return (
    <BaseIcon
      className="text-cyan-700 bg-cyan-100"
      icon={<LuMilk size={ICON_SIZE} />}
    />
  );
}

function GrainsIcon() {
  return (
    <BaseIcon
      className="text-amber-700 bg-amber-100"
      icon={<LuWheat size={ICON_SIZE} />}
    />
  );
}

function LegumesIcon() {
  return (
    <BaseIcon
      className="text-lime-700 bg-lime-100"
      icon={<LuSprout size={ICON_SIZE} />}
    />
  );
}

function NutsIcon() {
  return (
    <BaseIcon
      className="text-orange-700 bg-orange-100"
      icon={<GiAlmond size={ICON_SIZE} />}
    />
  );
}

function FatsIcon() {
  return (
    <BaseIcon
      className="text-yellow-700 bg-yellow-100"
      icon={<TbBottle size={ICON_SIZE} />}
    />
  );
}

function BeveragesIcon() {
  return (
    <BaseIcon
      className="text-blue-700 bg-blue-100"
      icon={<LuGlassWater size={ICON_SIZE} />}
    />
  );
}

function SupplementsIcon() {
  return (
    <BaseIcon
      className="text-violet-700 bg-violet-100"
      icon={<LuPill size={ICON_SIZE} />}
    />
  );
}

function OtherCategoryIcon() {
  return (
    <BaseIcon
      className="text-zinc-700 bg-zinc-100"
      icon={<LuCircleHelp size={ICON_SIZE} />}
    />
  );
}

function BaseIcon({
  icon,
  ...props
}: { icon: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...restProps } = props;

  return (
    <div
      className={twMerge(
        "w-12 h-12 rounded-sm bg-gray-200 text-gray-700 flex items-center justify-center",
        className,
      )}
      {...restProps}
    >
      {icon}
    </div>
  );
}
