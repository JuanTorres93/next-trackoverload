import { twMerge } from "tailwind-merge";

function Eyebrow({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  // TODO IMPORTANT: Finish styling when design is finished
  return (
    <h3
      className={twMerge(
        "uppercase inline-block text-primary py-2.75 px-5 w-fit rounded-full bg-primary-lightest text-sm",
        className,
      )}
      {...rest}
    >
      Nutrition first fitness for men who want clarity, not pressure.
    </h3>
  );
}

export default Eyebrow;
