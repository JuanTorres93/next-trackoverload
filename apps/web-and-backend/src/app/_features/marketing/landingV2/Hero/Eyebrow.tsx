import { twMerge } from "tailwind-merge";

function Eyebrow({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  // TODO IMPORTANT: Finish styling when design is finished
  return (
    <h3
      className={twMerge(
        "uppercase inline-block text-primary-light p-4 rounded-full bg-primary-light/10",
        className,
      )}
      {...rest}
    >
      Nutrition first fitness for men who want clarity, not pressure.
    </h3>
  );
}

export default Eyebrow;
