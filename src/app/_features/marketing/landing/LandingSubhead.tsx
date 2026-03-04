function LandingSubhead({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { className, ...rest } = props;

  return (
    <h2 {...rest} className={`${className} `}>
      {children}
    </h2>
  );
}

export default LandingSubhead;
