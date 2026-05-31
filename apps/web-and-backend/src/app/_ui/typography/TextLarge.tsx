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
    <Component {...rest} className={`text-lg ${className || ""}`}>
      {children}
    </Component>
  );
}

export default TextLarge;
