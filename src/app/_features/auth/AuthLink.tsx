import Link from 'next/link';

function AuthLink({ children, ...props }: React.ComponentProps<typeof Link>) {
  const { className, ...rest } = props;

  return (
    <Link
      className={`inline font-bold text-surface-dark transition hover:text-primary ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export default AuthLink;
