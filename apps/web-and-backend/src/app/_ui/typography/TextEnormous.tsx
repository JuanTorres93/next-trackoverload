import type { PolymorphicProps } from "./polymorphicType";

function TextEnormous<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-2xl max-bp-change-font:text-xl ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextEnormous;
