import { twMerge } from "tailwind-merge";

function ActiveSubscriptionTag({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-primary-light-app rounded-full w-fit py-0.5 px-2 font-medium text-[12px]",
        className,
      )}
      {...rest}
    >
      Active
    </div>
  );
}

export default ActiveSubscriptionTag;
