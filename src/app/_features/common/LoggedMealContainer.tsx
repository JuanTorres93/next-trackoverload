function LoggedMealContainer({
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`grid relative grid-rows-[1fr_auto] h-full max-h-48 overflow-hidden rounded-xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default LoggedMealContainer;
