"use client";

import { useState } from "react";

import { HiMagnifyingGlass, HiRectangleStack } from "react-icons/hi2";

import WorkoutTemplatesGrid from "@/app/_features/workouttemplate/WorkoutTemplatesGrid";
import { useWorkoutTemplateSearch } from "@/app/_features/workouttemplate/useWorkoutTemplateSearch";
import SearchInput from "@/app/_ui/SearchInput";
import ButtonNew from "@/app/_ui/buttons/ButtonNew";
import { WorkoutTemplateDTO } from "@/application-layer/dtos/WorkoutTemplateDTO";

function TemplatesDisplay({ templates }: { templates: WorkoutTemplateDTO[] }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const { query, setQuery, filteredTemplates } =
    useWorkoutTemplateSearch(templates);

  function handleNavigate() {
    setIsNavigating(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 max-bp-navbar-mobile:flex-col max-bp-navbar-mobile:items-start">
        <div>
          <h1 className="text-2xl font-bold text-text">Mis Plantillas</h1>
          <p className="text-sm text-text-minor-emphasis">
            {templates.length} plantilla{templates.length !== 1 ? "s" : ""}
          </p>
        </div>
        <ButtonNew
          href="/app/templates/new"
          onClick={handleNavigate}
          isLoading={isNavigating}
        >
          Nueva Plantilla
        </ButtonNew>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-minor-emphasis">
          <HiRectangleStack className="text-5xl opacity-30" />
          <div className="text-center">
            <p className="font-semibold">No hay plantillas</p>
            <p className="mt-1 text-sm opacity-60">
              Crea tu primera plantilla para empezar
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <SearchInput
            className="max-w-xs"
            placeholder="Buscar plantilla..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-text-minor-emphasis">
              <HiMagnifyingGlass className="text-4xl opacity-30" />
              <p className="text-sm">Sin resultados para &quot;{query}&quot;</p>
            </div>
          ) : (
            <WorkoutTemplatesGrid
              data-testid="templates-container"
              templates={filteredTemplates}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default TemplatesDisplay;
