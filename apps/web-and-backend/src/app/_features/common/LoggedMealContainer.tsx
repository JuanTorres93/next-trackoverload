function LoggedMealContainer({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`grid relative grid-rows-[1fr_auto] max-h-48 overflow-hidden rounded-xl border border-border ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default LoggedMealContainer;
