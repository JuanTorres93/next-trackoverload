'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '@/app/_ui/Spinner';

export default function SubscriptionSuccessRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/app/subscription');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-48">
      <Spinner />
    </div>
  );
}
