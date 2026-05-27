"use client";

import { createContext, useContext, useState } from "react";

import { FaCheck } from "react-icons/fa6";

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

// TODO IMPORTANT: Finish styling when design is done
export function FeatureSummary({ feature }: { feature: FeatureItemType }) {
  const { setCurrentFeaturePreviewId, currentFeaturePreviewId } =
    useFeaturesPreviewContext();

  const isSelected = currentFeaturePreviewId === feature.id;

  function handleSelectFeature() {
    setCurrentFeaturePreviewId!(feature.id);
  }

  return (
    <div
      className={`grid grid-cols-[max-content_1fr] gap-3  py-4 px-2 rounded-2xl cursor-default transition ${isSelected ? "bg-primary-light/10" : "bg-gray-200"}`}
      onClick={handleSelectFeature}
    >
      <div
        className={`flex items-center self-center justify-center bg-white rounded-lg aspect-square size-10 shrink-0 transition ${isSelected ? "text-primary-light" : "text-gray-500"}`}
      >
        {feature.logo}
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-lg font-semibold">{feature.summaryTitle}</h4>
        <span className="text-sm text-text-minor-emphasis">
          {feature.summarySubtitle}
        </span>
      </div>
    </div>
  );
}

// TODO IMPORTANT: Finish styling when design is done
export function FeatureDescription() {
  const { currentFeaturePreviewId, allFeatures } = useFeaturesPreviewContext();

  const feature = allFeatures.find((f) => f.id === currentFeaturePreviewId);

  return (
    <div className="grid grid-rows-[min-content_1fr] gap-6 bg-primary-light/10 p-6 rounded-3xl">
      <div>
        <h3>{feature!.mainTitle}</h3>
        <span>{feature!.mainSubtitle}</span>
      </div>

      <div className="flex flex-col gap-8 text-sm">
        <p>{feature!.mainDescription}</p>

        <ul className="flex flex-col gap-2 list-inside">
          {feature!.mainBullets.map((bullet, index) => (
            <li className="flex items-center gap-2 " key={index}>
              <div className="flex items-center justify-center p-1 rounded-full bg-primary-light/20 ">
                <FaCheck size={10} className="text-primary" />
              </div>

              <span className="text-text-minor-emphasis">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
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
  mainImageUrl: string;
};

FeaturesPreview.FeatureSummary = FeatureSummary;
FeaturesPreview.FeatureDescription = FeatureDescription;

export default FeaturesPreview;
