import PageWrapper from '@/app/_ui/PageWrapper';
import Spinner from '@/app/_ui/Spinner';

export default function Loading() {
  return (
    <PageWrapper className="flex items-center justify-center mt-8">
      <Spinner size={60} />
    </PageWrapper>
  );
}
