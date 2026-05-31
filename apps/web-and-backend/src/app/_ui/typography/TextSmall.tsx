import type { PolymorphicProps } from "./polymorphicType";

function TextSmall<T extends React.ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as || "div") as React.ElementType;

  return (
    <Component
      {...rest}
      className={`text-sm max-bp-change-font:text-xs ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextSmall;
