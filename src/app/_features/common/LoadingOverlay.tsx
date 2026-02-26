import Spinner from '@/app/_ui/Spinner';

function LoadingOverlay({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center bg-surface-light/30 backdrop-blur-[2px] ${className}`}
      {...rest}
    >
      <Spinner />
    </div>
  );
}

export default LoadingOverlay;
