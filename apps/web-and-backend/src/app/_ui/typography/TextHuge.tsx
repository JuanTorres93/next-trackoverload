import type { PolymorphicProps } from "./polymorphicType";

function TextHuge<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-5xl max-bp-change-font:text-4xl ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextHuge;
