function TextEnormous({
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
      className={`text-2xl max-bp-change-font:text-xl ${className || ""}`}
    >
      {children}
    </Component>
  );
}

export default TextEnormous;
