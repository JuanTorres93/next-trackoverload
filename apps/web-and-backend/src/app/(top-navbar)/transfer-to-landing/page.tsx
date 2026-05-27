import CEOMessage from "@/app/_features/marketing/landingV2/CEOMessage/CEOMessage";
import Features from "@/app/_features/marketing/landingV2/Features/Features";
import FinalCTA from "@/app/_features/marketing/landingV2/FinalCTA/FinalCTA";
import Hero from "@/app/_features/marketing/landingV2/Hero/Hero";
import HowItWorks from "@/app/_features/marketing/landingV2/HowItWorks/HowItWorks";
import NavBar from "@/app/_features/marketing/landingV2/NavBar";
import Pricing from "@/app/_features/marketing/landingV2/Pricing/Pricing";
import ReasonWhy from "@/app/_features/marketing/landingV2/ReasonWhy/ReasonWhy";

export default function LandingPage() {
  return (
    <main className="bg-surface-light">
      <div className="mt-15"></div>

      <div className="flex flex-col mx-auto gap-28 max-w-400">
        <NavBar />
        <Hero />
        <ReasonWhy />
        <HowItWorks />
        <Features />
        <CEOMessage />
        <Pricing />
        <FinalCTA />
      </div>
    </main>
  );
}
