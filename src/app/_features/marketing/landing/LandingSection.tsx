function LandingSection({
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { className, ...rest } = props;

  return (
    <section {...rest} className={`px-6 py-12 w-full text-center ${className}`}>
      {children}
    </section>
  );
}

export default LandingSection;
