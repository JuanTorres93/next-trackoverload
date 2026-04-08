import { useMemo, useState } from "react";

import Fuse from "fuse.js";

import { WorkoutTemplateDTO } from "@/application-layer/dtos/WorkoutTemplateDTO";

export function useWorkoutTemplateSearch(templates: WorkoutTemplateDTO[]) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(templates, {
        keys: ["name"],
        threshold: 0.4,
        includeScore: true,
      }),
    [templates],
  );

  const filteredTemplates = useMemo(() => {
    if (!query.trim()) return templates;

    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, templates]);

  return { query, setQuery, filteredTemplates };
}
