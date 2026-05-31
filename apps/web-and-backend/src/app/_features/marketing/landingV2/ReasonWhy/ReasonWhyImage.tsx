import Image from "next/image";

import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import afterImage from "@/../public/after.jpg";
import TextRegular from "@/app/_ui/typography/TextRegular";

import UserAvatar from "./UserAvatar";

async function ReasonWhyImage({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("relative h-full", className)} {...rest}>
      <div className="relative h-full overflow-hidden rounded-3xl ">
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

async function PopupOverlay({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const t = await getTranslations("LandingPage.about");

  return (
    <div
      className={twMerge(
        "grid grid-cols-[min-content_1fr] gap-2 py-6 px-3.5 items-center overflow-hidden border border-primary/70 backdrop-blur-xs absolute bottom-0 left-0 right-0 m-3  rounded-3xl shadow-lg z-2",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-center z-3">
        <div className="relative w-24 h-12 ">
          {userPictures.map((user, index) => (
            <UserAvatar
              className="absolute"
              key={index}
              image={user.src}
              style={{
                left: `${index * 22}px`,
              }}
            />
          ))}
        </div>
      </div>

      <TextRegular as="p" className={`font-medium text-white z-3`}>
        {t("badge")}
      </TextRegular>

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
