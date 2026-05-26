import Image from "next/image";

import { twMerge } from "tailwind-merge";

import afterImage from "@/../public/after.jpg";

// TODO IMPORTANT: Finish styling when design is done
function ReasonWhyImage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("relative", className)} {...rest}>
      <div className="relative w-full overflow-hidden md:aspect-4/5 rounded-3xl">
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
        "grid grid-cols-[min-content_1fr] gap-2 p-6 bg-emerald-700/40 border border-emerald-700/70 backdrop-blur-xs absolute bottom-0 left-0 right-0 m-3 text-white rounded-3xl shadow-lg z-2",
        className,
      )}
      {...rest}
    >
      <div>USERS</div>
      <p>
        Trusted by our early users who started their fitness journey from
        scratch
      </p>
    </div>
  );
}

export default ReasonWhyImage;
