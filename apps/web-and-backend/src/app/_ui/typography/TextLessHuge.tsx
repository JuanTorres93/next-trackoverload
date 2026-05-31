function TextLessHuge({
  as: Component = "div",
  children,
  ...props
}: {
  as?: React.ElementType;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;

  return (
    <Component {...rest} className={`text-4xl ${className || ""}`}>
      {children}
    </Component>
  );
}

export default TextLessHuge;
