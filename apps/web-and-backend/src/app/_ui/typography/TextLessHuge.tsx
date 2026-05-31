import type { PolymorphicProps } from "./polymorphicType";

function TextLessHuge<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-4xl max-bp-change-font:text-3xl ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextLessHuge;
