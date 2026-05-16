import Image, { StaticImageData } from 'next/image';

interface BeforeAfterProps {
  beforeImage: string | StaticImageData;
  afterImage: string | StaticImageData;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = 'Antes',
  afterLabel = 'Después',
  className = '',
}: BeforeAfterProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ${className}`}
    >
      {/* Before */}
      <div className="relative overflow-hidden shadow-lg rounded-2xl">
        <div className="relative aspect-square md:aspect-[4/5] w-full">
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute px-4 py-2 text-sm font-medium text-white rounded-full bottom-4 left-4 bg-black/50 backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      {/* After */}
      <div className="relative overflow-hidden shadow-lg rounded-2xl">
        <div className="relative aspect-square md:aspect-[4/5] w-full">
          <Image
            src={afterImage}
            alt={afterLabel}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute px-4 py-2 text-sm font-medium text-white rounded-full bottom-4 left-4 bg-black/50 backdrop-blur-sm">
          {afterLabel}
        </div>
      </div>
    </div>
  );
}
