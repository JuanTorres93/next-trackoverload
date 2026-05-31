import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import BulletList, { BulletItemType } from "./BulletList";
import ReasonWhyImage from "./ReasonWhyImage";

function ReasonWhy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("", className)}
      title="Why traditional fitness apps make you quit."
      subtitle="You're not failing because you're lazy. You're failing because the tools and advice weren't designed for someone starting where you are."
      id="about"
      {...rest}
    >
      <div className="grid items-end grid-cols-3 gap-8 max-bp-landing-reason-why:grid-cols-2 max-bp-landing-reason-why:grid-rows-2 max-bp-landing-reason-why-mobile:grid-cols-1 max-bp-landing-reason-why-mobile:grid-rows-auto">
        <BulletList
          listTitle="What is draining your confidence:"
          bullets={badBullets}
          className="max-bp-landing-reason-why:row-start-1"
        />

        <ReasonWhyImage className="max-bp-landing-reason-why:row-start-2 max-bp-landing-reason-why:col-span-2 max-bp-landing-reason-why-mobile:col-span-1" />

        <BulletList
          listTitle="How Cimientos changes the game:"
          bullets={goodBullets}
          isGood
          className="max-bp-landing-reason-why:row-start-1 max-bp-landing-reason-why-mobile:row-start-3"
        />
      </div>
    </LandingSection>
  );
}

const badBullets: BulletItemType[] = [
  {
    intro: "Micromanaging every single gram:",
    description:
      "Scanning barcodes for every single lettuce leaf breeds mental stress and deep anxiety.",
  },
  {
    intro: "Hyper-focused on extreme bodybuilders:",
    description: "Relentless six-pack ads make normal progress feel worthless.",
  },
  {
    intro: "Aggresive, strict streak systems:",
    description:
      " Missing one day triggers alerts that himiliate you into complete paralysis.",
  },
  {
    intro: "Overthinking & overplanning:",
    description:
      "Spending 3 hours researching perfect routines without ever lifting a single weight.",
  },
];

const goodBullets: BulletItemType[] = [
  {
    intro:
      "Meals are measured by grams, and estimates from food packages are fine. Each meal is weighed once and saved as a reusable recipe for easy tracking and repeat use",
  },
  {
    intro: "Self-respect first:",
    description:
      "Designed for introverted or timid guys looking to build confidence and strength from scratch.",
  },
  {
    intro: "Adaptive consistency metrics:",
    description:
      "A missed day isn't a failure, it's just a normal human break. The tracking recalculates automatically.",
  },
  {
    description:
      "Your calorie requirements evolve naturally. Learn how to adjust them based on your own body's feedback with our simple step-by-step guidance.",
  },
];

export default ReasonWhy;
