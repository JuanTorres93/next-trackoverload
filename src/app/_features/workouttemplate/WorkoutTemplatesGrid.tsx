import { twMerge } from "tailwind-merge";

import GridAutoCols from "@/app/_ui/GridAutoCols";
import { WorkoutTemplateDTO } from "@/application-layer/dtos/WorkoutTemplateDTO";

import WorkoutTemplate from "./WorkoutTemplate";

function WorkoutTemplatesGrid({
  templates,
  ...props
}: {
  templates: WorkoutTemplateDTO[];
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <GridAutoCols
      className={twMerge("gap-4", className)}
      fitOrFill="fill"
      min="14rem"
      max="1fr"
      {...rest}
    >
      {templates.map((template) => (
        <WorkoutTemplate key={template.id} workoutTemplate={template} />
      ))}
    </GridAutoCols>
  );
}

export default WorkoutTemplatesGrid;
