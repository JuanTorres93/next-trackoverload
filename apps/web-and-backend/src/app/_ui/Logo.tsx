import Image from 'next/image';

function Logo({ size = 50 }: { size?: number }) {
  return (
    <Image src="/logo.svg" width={size} height={size} alt="Logo" priority />
  );
}

export default Logo;
