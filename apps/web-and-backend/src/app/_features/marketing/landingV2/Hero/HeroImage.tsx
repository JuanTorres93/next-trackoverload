import Image from "next/image";

import { twMerge } from "tailwind-merge";

import afterImage from "@/../public/after.jpg";

function HeroImage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("relative h-full", className)} {...rest}>
      <PopupOverlay />
      <div>Image</div>

      <div className="relative my-4 mx-10 aspect-square md:aspect-[4/5] w-full rounded-3xl overflow-hidden">
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
        "p-6 bg-primary-light absolute top-0 left-0 text-white rounded-lg shadow-lg z-2",
        className,
      )}
      {...rest}
    >
      <h2 className="mb-4 text-xl font-bold">Popup Content</h2>
      <p>This is a popup overlay.</p>
    </div>
  );
}

export default HeroImage;
