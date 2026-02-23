import Spinner from '@/app/_ui/Spinner';

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-light/30 backdrop-blur-[2px]">
      <Spinner />
    </div>
  );
}

export default LoadingOverlay;
