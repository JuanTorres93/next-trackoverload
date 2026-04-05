import { twMerge } from "tailwind-merge";

import TextRegular from "./typography/TextRegular";

function Input({
  containerClassName,
  children,
  type,
  onChange,
  ...props
}: {
  containerClassName?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, disabled, ...rest } = props;

  const isNumberInput = type === "number";

  const disabledStyle =
    "bg-input-background-disabled! text-text-minor-emphasis! border-border/30!";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isNumberInput) {
      e.target.value = e.target.value.replace(",", ".");
    }

    onChange?.(e);
  }

  return (
    <TextRegular
      className={twMerge(
        `flex items-center min-w-22 justify-start border border-border py-1 px-4 rounded-lg bg-input-background text-input-text ${disabled ? disabledStyle : ""}`,
        containerClassName,
      )}
    >
      <input
        type={isNumberInput ? "text" : type}
        inputMode={isNumberInput ? "decimal" : undefined}
        role={isNumberInput ? "spinbutton" : undefined}
        className={twMerge(
          `outline-none w-full disabled:cursor-not-allowed disabled:text-text-minor-emphasis!}`,
          className,
        )}
        disabled={disabled}
        onChange={handleChange}
        {...rest}
      />

      {children}
    </TextRegular>
  );
}

export default Input;
