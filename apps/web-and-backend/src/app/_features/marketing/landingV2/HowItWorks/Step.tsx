import { twMerge } from "tailwind-merge";

// TODO IMPORTANT: Finish styling when design is done
function Step({
  step,
  ...props
}: { step: StepItemType } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-primary-lightest py-10 px-7.5 rounded-3xl flex flex-col gap-6",
        className,
      )}
      {...rest}
    >
      <span className="self-start p-3 text-4xl text-white rounded-2xl bg-primary-light font-secondary">
        {step.numberString}
      </span>

      <div></div>

      <h3 className="text-2xl font-medium font-secondary">{step.title}</h3>

      <p className={`text-base text-text-minor-emphasis`}>{step.description}</p>
    </div>
  );
}

export type StepItemType = {
  numberString: string;
  title: string;
  description: string;
};

export default Step;
