import { ImagesRepo } from "@/domain/repos/ImagesRepo.port";
import { CloudinaryImagesRepo } from "@/infra/repos/cloudinary/CloudinaryImagesRepo/CloudinaryImagesRepo";
import { MemoryImagesRepo } from "@/infra/repos/memory/MemoryImagesRepo";
import { injectFor_ProductionDevelopment_Test } from "@/interface-adapters/common/injectFor_ProductionDevelopment_Test";

const AppImagesRepo: ImagesRepo =
  await injectFor_ProductionDevelopment_Test<ImagesRepo>(
    CloudinaryImagesRepo,
    MemoryImagesRepo,
  );

export { AppImagesRepo };
