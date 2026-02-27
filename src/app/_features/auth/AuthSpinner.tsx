import Spinner from '@/app/_ui/Spinner';

function AuthSpinner({ className }: { className?: string }) {
  return (
    <Spinner className={`m-auto ${className}`} strokeWidth={2} size={24} />
  );
}

export default AuthSpinner;
