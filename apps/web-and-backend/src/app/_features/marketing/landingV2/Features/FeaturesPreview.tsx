"use client";

import Image, { StaticImageData } from "next/image";

import { createContext, useContext, useState } from "react";

import { FaCheck } from "react-icons/fa6";
import { twMerge } from "tailwind-merge";

import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextLarge from "@/app/_ui/typography/TextLarge";
import TextRegular from "@/app/_ui/typography/TextRegular";

type FeaturesPreviewContextType = {
  currentFeaturePreviewId: string;
  setCurrentFeaturePreviewId?: (id: string) => void;
  allFeatures: FeatureItemType[];
};

const FeaturesPreviewContext = createContext<FeaturesPreviewContextType | null>(
  null,
);

function FeaturesPreview({
  features,
  children,
}: {
  features: FeatureItemType[];
  children: React.ReactNode;
}) {
  const [currentFeaturePreviewId, setCurrentFeaturePreviewId] =
    useState<string>(features[0].id);

  return (
    <FeaturesPreviewContext.Provider
      value={{
        currentFeaturePreviewId,
        setCurrentFeaturePreviewId,
        allFeatures: [...features],
      }}
    >
      {children}
    </FeaturesPreviewContext.Provider>
  );
}

export function FeatureSummary({ feature }: { feature: FeatureItemType }) {
  const { setCurrentFeaturePreviewId, currentFeaturePreviewId } =
    useFeaturesPreviewContext();

  const isSelected = currentFeaturePreviewId === feature.id;

  function handleSelectFeature() {
    setCurrentFeaturePreviewId!(feature.id);
  }

  return (
    <div
      className={`grid grid-cols-[max-content_1fr] gap-4 p-6 rounded-2xl cursor-default transition ${isSelected ? "bg-primary-lightest" : "bg-gray-200"}`}
      onClick={handleSelectFeature}
    >
      <LogoBox
        logo={feature.logo}
        isSelected={isSelected}
        className="self-center max-bp-landing-features-smallest:self-start"
      />

      <div className="flex flex-col gap-2">
        <TextEnormous as="h4" className="font-medium">
          {feature.summaryTitle}
        </TextEnormous>

        <TextLarge as="span" className="text-text-minor-emphasis">
          {feature.summarySubtitle}
        </TextLarge>
      </div>
    </div>
  );
}

export function FeatureDescription() {
  const { currentFeaturePreviewId, allFeatures } = useFeaturesPreviewContext();

  const feature = allFeatures.find((f) => f.id === currentFeaturePreviewId);

  return (
    <div className="flex flex-col p-6 gap-9 bg-primary-lightest rounded-3xl">
      <div className="flex gap-4 ">
        <LogoBox className="mt-2" logo={feature!.logo} isSelected={true} />

        <div className="flex flex-col gap-2">
          <h3 className="text-[28px] font-medium font-secondary max-bp-change-font:text-[26px]">
            {feature!.mainTitle}
          </h3>

          <TextLarge as="span" className="text-text-minor-emphasis">
            {feature!.mainSubtitle}
          </TextLarge>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_.6fr] h-full gap-6 max-bp-landing-features-smallest:grid-cols-1 max-bp-landing-features-smallest:gap-10">
        <TextRegular className="flex flex-col gap-9">
          <p>{feature!.mainDescription}</p>

          <ul className="flex flex-col gap-2 list-inside">
            {feature!.mainBullets.map((bullet, index) => (
              <li className="flex items-center gap-4.5" key={index}>
                <div className="flex items-center justify-center p-1 rounded-full bg-primary-light/30 ">
                  <FaCheck size={10} className="text-primary" />
                </div>

                <span className="text-text-minor-emphasis">{bullet}</span>
              </li>
            ))}
          </ul>
        </TextRegular>

        <div className="relative h-full overflow-hidden rounded-2xl max-bp-landing-features-smallest:h-60">
          <Image
            src={feature!.mainImageUrl}
            alt={feature!.mainTitle}
            className="object-cover"
            fill
          />
        </div>
      </div>
    </div>
  );
}

function LogoBox({
  logo,
  isSelected,
  ...props
}: {
  logo: React.ReactNode;
  isSelected: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        `flex items-center justify-center bg-white rounded-lg aspect-square size-12 transition ${isSelected ? "text-primary" : "text-text"} max-bp-landing-features-smallest:size-10`,
        className,
      )}
      {...rest}
    >
      {logo}
    </div>
  );
}

function useFeaturesPreviewContext() {
  const contextValue = useContext(FeaturesPreviewContext);

  if (!contextValue) {
    throw new Error(
      "useFeaturesPreviewContext must be used within a FeaturesPreviewProvider",
    );
  }

  return contextValue;
}

export type FeatureItemType = {
  id: string;

  logo: React.ReactNode;

  summaryTitle: string;
  summarySubtitle: string;

  mainTitle: string;
  mainSubtitle: string;
  mainDescription: string;
  mainBullets: string[];
  mainImageUrl: string | StaticImageData;
};

FeaturesPreview.FeatureSummary = FeatureSummary;
FeaturesPreview.FeatureDescription = FeatureDescription;

export default FeaturesPreview;
