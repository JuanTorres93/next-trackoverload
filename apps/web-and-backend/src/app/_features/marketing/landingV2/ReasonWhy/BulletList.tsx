import { CiCircleRemove } from "react-icons/ci";
import { FaCircleCheck } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

// TODO IMPORTANT: Finish styling when design is done
function BulletList({
  bullets,
  listTitle,
  isGood,
  ...props
}: {
  bullets: BulletItemType[];
  listTitle: string;
  isGood?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-8", className)} {...rest}>
      <h3
        className={`text-[28px] font-medium leading-[124%] ${isGood && " text-primary-light"}`}
      >
        {listTitle}
      </h3>

      <div
        className={twMerge(
          "p-6 rounded-3xl",
          `${isGood ? "bg-primary-light" : "bg-neutral"}`,
        )}
        {...rest}
      >
        <ul className="flex flex-col gap-8">
          {bullets.map((bullet, index) => (
            <li key={index}>
              <BulletItem item={bullet} isGood={isGood} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export type BulletItemType = {
  intro?: string;
  description?: string;
};

function BulletItem({
  item,
  isGood,
}: {
  item: BulletItemType;
  isGood?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-1">
        {isGood ? (
          <FaCircleCheck size={17} className="text-white" />
        ) : (
          <CiCircleRemove size={19} strokeWidth={0.5} className="text-error" />
        )}
      </div>

      <div
        className={`text-base ${isGood ? "text-white" : "text-text-minor-emphasis"}`}
      >
        {item.intro && <span className="font-semibold">{item.intro} </span>}

        {item.description && <span>{item.description}</span>}
      </div>
    </div>
  );
}

export default BulletList;
