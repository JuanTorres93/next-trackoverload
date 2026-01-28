function SectionHeading({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`pb-3 mb-6 text-4xl font-bold ${className || ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default SectionHeading;
