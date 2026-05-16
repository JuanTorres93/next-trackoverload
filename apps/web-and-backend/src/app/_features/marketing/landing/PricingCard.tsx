import { FaCheck } from "react-icons/fa";

import ButtonCTA from "./ButtonCTA";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  className?: string;
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  ctaText,
  ctaHref,
  className = "",
}: PricingCardProps) {
  return (
    <div
      className={`
      relative p-8 rounded-2xl bg-primary text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105
      ${className}
    `}
    >
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <div className="mt-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className="ml-2 text-white/80">/mes</span>
      </div>

      <p className="mt-2 text-white/80">{description}</p>

      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <FaCheck className="w-5 h-5 mt-0.5 flex-shrink-0 text-white" />

            <span className="text-white/90">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <ButtonCTA
          href={ctaHref}
          className="w-full justify-center !bg-white !text-primary hover:!bg-gray-100"
        >
          {ctaText}
        </ButtonCTA>
      </div>
    </div>
  );
}
