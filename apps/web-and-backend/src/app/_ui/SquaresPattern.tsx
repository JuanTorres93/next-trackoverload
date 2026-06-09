import { twMerge } from "tailwind-merge";

function SquaresPattern({
  color = "white",
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { color?: string }) {
  return (
    <div
      style={
        {
          "--square-color": color,
        } as React.CSSProperties
      }
      className={twMerge(
        "size-36.5 opacity-11 [background:repeating-conic-gradient(transparent_0_90deg,var(--square-color)_0_180deg)_0_0/50%_50%] mask-[linear-gradient(to_left,black_0%,black_10%,transparent)]",
        className,
      )}
      {...rest}
    />
  );
}

export default SquaresPattern;
