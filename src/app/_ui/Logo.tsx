import logo from '@/../public/logo.png';
import Image from 'next/image';

function Logo({ size = 50 }: { size?: number }) {
  return (
    <div>
      <Image src={logo} width={size} height={size} alt="Logo" />
    </div>
  );
}

export default Logo;
