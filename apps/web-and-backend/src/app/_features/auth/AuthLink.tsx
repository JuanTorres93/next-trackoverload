import Link from 'next/link';

function AuthLink({ children, ...props }: React.ComponentProps<typeof Link>) {
  const { className, ...rest } = props;

  return (
    <Link
      className={`inline font-bold transition text-primary hover:text-primary-light ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export default AuthLink;
