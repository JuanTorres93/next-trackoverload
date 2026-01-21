function TextSmall({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`text-sm ${className || ''}`}>{children}</div>;
}

export default TextSmall;
