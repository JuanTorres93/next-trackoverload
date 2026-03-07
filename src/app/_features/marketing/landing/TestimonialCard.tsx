// app/_features/marketing/landing/TestimonialCard.tsx
import Image from 'next/image';
import { FaQuoteLeft } from 'react-icons/fa';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  className?: string;
}

export default function TestimonialCard({
  quote,
  author,
  role,
  image,
  className = '',
}: TestimonialCardProps) {
  return (
    <div
      className={`relative p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <FaQuoteLeft className="absolute w-8 h-8 top-6 right-6 text-primary/10" />
      <p className="leading-relaxed text-text-minor-emphasis">{quote}</p>
      <div className="flex items-center gap-4 mt-6">
        {image && (
          <div className="relative w-12 h-12 overflow-hidden rounded-full">
            <Image src={image} alt={author} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-semibold text-text">{author}</p>
          {role && <p className="text-sm text-text-minor-emphasis">{role}</p>}
        </div>
      </div>
    </div>
  );
}
