import Image from "next/image";

import { twMerge } from "tailwind-merge";

import afterImage from "@/../public/after.jpg";

// TODO IMPORTANT: Finish styling when design is done
function HeroImage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("relative h-full", className)} {...rest}>
      <PopupOverlay />

      <div className="relative bg-primary-lightest ml-8 mt-8 h-[92%] w-[92%] overflow-hidden rounded-3xl">
        <Image
          src={afterImage}
          alt={"Hero Image"}
          fill
          className="object-cover"
          priority
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
        "p-6 bg-primary-light absolute top-0 left-0 text-white rounded-lg shadow-2xl z-2",
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
