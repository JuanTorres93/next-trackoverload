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

  return (
    <div
      className={twMerge(
        `flex gap-4 ${subtitle ? "justify-between" : "justify-center"}`,
        className,
      )}
      {...rest}
    >
      <h2
        className={`text-4xl font-medium font-secondary ${subtitle ? "max-w-[33%]" : "max-w-[60%]"}`}
      >
        {title}
      </h2>

      {subtitle && (
        <p className={`max-w-[45%] text-lg text-text-minor-emphasis`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default SectionTitle;
