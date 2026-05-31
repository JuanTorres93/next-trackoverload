import type { PolymorphicProps } from "./polymorphicType";

function TextRegular<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-base max-bp-change-font:text-sm ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextRegular;
