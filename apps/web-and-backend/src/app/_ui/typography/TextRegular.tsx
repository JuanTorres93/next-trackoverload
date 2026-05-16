function TextRegular({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div {...rest} className={`text-base ${className || ''}`}>
      {children}
    </div>
  );
}

export default TextRegular;
