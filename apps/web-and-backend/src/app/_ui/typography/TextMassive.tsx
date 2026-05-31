import type { PolymorphicProps } from "./polymorphicType";

function TextMassive<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-6xl max-bp-change-font:text-5xl ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextMassive;
