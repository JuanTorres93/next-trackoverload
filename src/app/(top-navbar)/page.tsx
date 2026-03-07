import Hero from '@/app/_features/marketing/landing/Hero';

import Story from '@/app//_features/marketing/landing/sections/Story';
import Transformation from '@/app//_features/marketing/landing/sections/Transformation';
import Amplify from '@/app/_features/marketing/landing/sections/Amplify';
import Offer from '@/app/_features/marketing/landing/sections/Offer';
import Problem from '@/app/_features/marketing/landing/sections/Problem';
import Response from '@/app/_features/marketing/landing/sections/Response';

export default function LandingPage() {
  return (
    <main className="bg-surface-light">
      <Hero />

      <Problem />

      <Amplify />

      <Story />

      <Transformation />

      <Offer />

      <Response />
    </main>
  );
}
