import { twMerge } from "tailwind-merge";

function SectionTitle({
  title,
  subtitle,
  ...props
}: {
  title: string;
  subtitle?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  // TODO IMPORTANT: Finish styling when design is done
  return (
    <div className={twMerge("flex justify-between gap-4", className)} {...rest}>
      <h2 className="max-w-[33%] text-4xl font-semibold">{title}</h2>

      {subtitle && (
        <p className="max-w-[45%] text-base text-text-minor-emphasis">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
