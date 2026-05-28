import Image from "next/image";
import { StaticImageData } from "next/image";

import { twMerge } from "tailwind-merge";

function UserAvatar({
  image,
  ...props
}: { image: string | StaticImageData } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "size-13 rounded-full overflow-hidden border-2 border-white",
        className,
      )}
      {...rest}
    >
      <div className="relative w-full h-full">
        <Image src={image} alt="User Avatar" fill className="object-fit" />
      </div>
    </div>
  );
}

export default UserAvatar;
