function FormRow({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...restProps } = props;

  return (
    <div className={`flex gap-4 ${className ?? ''}`} {...restProps}>
      {children}
    </div>
  );
}

export default FormRow;
