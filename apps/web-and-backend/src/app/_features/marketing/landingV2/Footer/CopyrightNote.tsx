import { twMerge } from "tailwind-merge";

function CopyrightNote({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "text-center text-xs py-4 border-t border-white",
        className,
      )}
      {...rest}
    >
      &copy; {new Date().getFullYear()} Cimientos. All rights reserved.
    </div>
  );
}

export default CopyrightNote;
