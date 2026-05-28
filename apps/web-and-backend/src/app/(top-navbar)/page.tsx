import CEOMessage from "@/app/_features/marketing/landingV2/CEOMessage/CEOMessage";
import Features from "@/app/_features/marketing/landingV2/Features/Features";
import FinalCTA from "@/app/_features/marketing/landingV2/FinalCTA/FinalCTA";
import Hero from "@/app/_features/marketing/landingV2/Hero/Hero";
import HowItWorks from "@/app/_features/marketing/landingV2/HowItWorks/HowItWorks";
import Pricing from "@/app/_features/marketing/landingV2/Pricing/Pricing";
import ReasonWhy from "@/app/_features/marketing/landingV2/ReasonWhy/ReasonWhy";

export default function LandingPage() {
  return (
    <main className="bg-white">
      <div className="flex flex-col mx-auto overflow-hidden gap-25 max-w-400">
        <div className="flex pt-25 flex-col gap-25 bg-[linear-gradient(to_right,rgba(17,24,39,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(17,24,39,0.06)_1px,transparent_1px)] bg-size-[100px_100px]">
          <Hero />
        </div>

        <ReasonWhy />
        <HowItWorks />
        <Features />
        <CEOMessage id="testimonials" />
        <Pricing />
        <FinalCTA />
      </div>
    </main>
  );
}
