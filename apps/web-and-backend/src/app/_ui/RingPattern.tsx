import { twMerge } from "tailwind-merge";

function RingPattern({
  color = "#ebede6",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { color?: string }) {
  return (
    <div
      style={
        {
          "--ring-color": color,
        } as React.CSSProperties
      }
      className={twMerge(
        "size-36.5 opacity-20 rounded-full bg-(--ring-color) mask-[radial-gradient(circle,transparent_0_33%,black_34%)]",
        className,
      )}
      {...rest}
    />
  );
}

export default RingPattern;
