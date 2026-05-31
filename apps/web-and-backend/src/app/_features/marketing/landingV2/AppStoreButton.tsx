import Image from "next/image";
import Link from "next/link";

import { twMerge } from "tailwind-merge";

function AppStoreButton({ ...props }: React.HTMLAttributes<HTMLAnchorElement>) {
  const { className, ...rest } = props;

  return (
    <Link
      // TODO IMPORTANT: Update link when published
      href="https://apps.apple.com/app/id123456789"
      target="_blank"
      rel="noopener noreferrer"
      className={twMerge("", className)}
      {...rest}
    >
      <div>
        <Image
          src="/AppStore_English.svg"
          alt="Download on the App Store"
          className="w-auto h-12"
          fill
        />
      </div>
    </Link>
  );
}

export default AppStoreButton;
