function TextLarge({
  as: Component = "div",
  children,
  ...props
}: {
  as?: React.ElementType;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;

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
