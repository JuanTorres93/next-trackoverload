function TextSmall({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={`text-sm ${className || ''}`} {...rest}>
      {children}
    </div>
  );
}

export default TextSmall;
