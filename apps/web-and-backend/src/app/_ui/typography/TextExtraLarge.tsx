import type { PolymorphicProps } from "./polymorphicType";

function TextExtraLarge<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-xl max-bp-change-font:text-lg ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextExtraLarge;
