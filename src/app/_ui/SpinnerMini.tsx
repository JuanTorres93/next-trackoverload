import Spinner from '@/app/_ui/Spinner';

function SpinnerMini({ className }: { className?: string }) {
  return <Spinner className={`${className}`} strokeWidth={2} size={24} />;
}

export default SpinnerMini;
