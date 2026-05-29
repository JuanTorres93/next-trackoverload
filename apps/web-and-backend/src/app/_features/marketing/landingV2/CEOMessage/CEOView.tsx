import Image from "next/image";

import { twMerge } from "tailwind-merge";

import ceoImage from "@/../public/yo-cimientos.webp";

function CEOView({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge("flex flex-col gap-5 text-white", className)}
      {...rest}
    >
      <div className="relative w-full overflow-hidden aspect-4/5 rounded-2xl">
        <Image
          src={ceoImage}
          alt={"Hero Image"}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 py-2 bg-primary-light rounded-2xl">
        <h3 className="text-2xl font-semibold font-secondary">Juan Torres</h3>

        <h4>Founder & CEO of Cimientos</h4>
      </div>
    </div>
  );
}

export default CEOView;
