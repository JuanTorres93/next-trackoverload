import Hero from '@/app/_features/marketing/landing/Hero';

import Story from '@/app//_features/marketing/landing/sections/Story';
import Transformation from '@/app//_features/marketing/landing/sections/Transformation';
import Amplify from '@/app/_features/marketing/landing/sections/Amplify';
import Offer from '@/app/_features/marketing/landing/sections/Offer';
import Problem from '@/app/_features/marketing/landing/sections/Problem';
import Response from '@/app/_features/marketing/landing/sections/Response';
import Testimonial from '@/app/_features/marketing/landing/sections/Testimonial';
import Lead from '@/app/_features/marketing/landing/sections/Lead';
import Roadmap from '@/app/_features/marketing/landing/sections/Roadmap';

export default function LandingPage() {
  return (
    <main className="bg-surface-light">
      <div className="mt-15"></div>
      <Hero />

      <Lead />

      <Problem />

      <Amplify />

      <Story />

      <Testimonial />

      <Transformation />

      <Offer />

      <Roadmap />

      <Response />
    </main>
  );
}
