import type { PolymorphicProps } from "./polymorphicType";

function TextLarge<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-lg max-bp-change-font:text-base ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextLarge;
