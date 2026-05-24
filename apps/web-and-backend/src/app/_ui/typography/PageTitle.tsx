import { twMerge } from "tailwind-merge";

function PageTitle({
  title,
  subtitle,
  ...props
}: {
  title: string;
  subtitle?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <h1 className="text-2xl font-bold text-text">{title}</h1>
      {subtitle && (
        <p className="text-sm text-text-minor-emphasis">{subtitle}</p>
      )}
    </div>
  );
}

export default PageTitle;
