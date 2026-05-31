import Image from "next/image";
import Link from "next/link";

import { twMerge } from "tailwind-merge";

function GooglePlayButton({
  ...props
}: React.HTMLAttributes<HTMLAnchorElement>) {
  const { className, ...rest } = props;

  return (
    <Link
      // TODO IMPORTANT: Update link when published
      href="https://play.google.com/store/apps/details?id=com.example.app"
      target="_blank"
      rel="noopener noreferrer"
      className={twMerge("", className)}
      {...rest}
    >
      <div>
        <Image
          src="/GooglePlay_color_English.svg"
          alt="Get it on Google Play"
          className="w-auto h-12"
          fill
        />
      </div>
    </Link>
  );
}

export default GooglePlayButton;
