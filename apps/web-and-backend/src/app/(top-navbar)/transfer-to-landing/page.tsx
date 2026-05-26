import CEOMessage from "@/app/_features/marketing/landingV2/CEOMessage/CEOMessage";
import Hero from "@/app/_features/marketing/landingV2/Hero/Hero";
import HowItWorks from "@/app/_features/marketing/landingV2/HowItWorks/HowItWorks";
import NavBar from "@/app/_features/marketing/landingV2/NavBar";
import ReasonWhy from "@/app/_features/marketing/landingV2/ReasonWhy/ReasonWhy";

export default function LandingPage() {
  return (
    <main className="bg-surface-light">
      <div className="mt-15"></div>

      <NavBar />
      <Hero />
      <ReasonWhy />
      <HowItWorks />
      {/* Features here */}
      <CEOMessage />
    </main>
  );
}
