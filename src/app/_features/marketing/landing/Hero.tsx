import heroImage from '@/../public/hero.png';
import Image from 'next/image';

function Hero() {
  return (
    <section className="w-full h-[80dvh] relative">
      <Image
        src={heroImage}
        alt="Hero Image"
        fill
        objectFit="cover"
        objectPosition="center"
      />
    </section>
  );
}

export default Hero;
