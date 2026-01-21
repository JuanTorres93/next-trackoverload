function FormRow({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex gap-4" {...props}>
      {children}
    </div>
  );
}

export default FormRow;
