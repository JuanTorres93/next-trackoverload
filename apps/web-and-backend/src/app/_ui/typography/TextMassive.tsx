function TextMassive({
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
      className={`text-6xl max-bp-change-font:text-5xl ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextMassive;
