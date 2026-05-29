import Image from "next/image";

import { twMerge } from "tailwind-merge";

import afterImage from "@/../public/after.jpg";

import UserAvatar from "./UserAvatar";

function ReasonWhyImage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("relative h-full", className)} {...rest}>
      <div className="relative h-full overflow-hidden rounded-3xl">
        <PopupOverlay />

        <Image
          src={afterImage}
          alt={"Hero Image"}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

function PopupOverlay({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "grid grid-cols-[min-content_1fr] gap-2 py-6 px-3.5  overflow-hidden border border-primary/70 backdrop-blur-xs absolute bottom-0 left-0 right-0 m-3  rounded-3xl shadow-lg z-2",
        className,
      )}
      {...rest}
    >
      <div className="relative w-24 z-3">
        {userPictures.map((user, index) => (
          <UserAvatar
            className="absolute top-3"
            key={index}
            image={user.src}
            style={{
              left: `${index * 22}px`,
            }}
          />
        ))}
      </div>

      <p className={`text-base font-medium text-white z-3`}>
        Trusted by our early users who started their fitness journey from
        scratch
      </p>

      <div className="absolute inset-0 z-2 opacity-40 bg-linear-to-b from-primary-light to-primary-lightest"></div>
    </div>
  );
}

const userPictures = [
  {
    src: afterImage,
  },
  {
    src: afterImage,
  },
  {
    src: afterImage,
  },
];

export default ReasonWhyImage;
