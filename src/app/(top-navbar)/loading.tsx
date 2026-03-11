import Spinner from '@/app/_ui/Spinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-dvh">
      <Spinner size={60} />
    </div>
  );
}
