import { eachDayOfInterval, endOfWeek, startOfWeek } from "date-fns";

import ErrorBox from "@/app/_ui/ErrorBox";

import { DayId } from "../../../domain/value-objects/DayId/DayId";
import { getAssembledDaysByIds } from "../../_features/day/actions";
import { parseFilterValueToDate } from "../../_features/day/utils/parseFilterValueToDate";
import PageWrapper from "../../_ui/PageWrapper";
import MealsDisplay from "./MealsDisplay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Comidas",
  description: "Planificación de comidas",
};

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;

  let currentDate = new Date();

  if (params.week) {
    currentDate = parseFilterValueToDate(params.week);
  }

  const dayStartWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const dayEndWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = eachDayOfInterval({
    start: dayStartWeek,
    end: dayEndWeek,
  });

  const dayIds = daysOfWeek.map(
    (day) =>
      DayId.create({
        day: day.getDate(),
        month: day.getMonth() + 1,
        year: day.getFullYear(),
      }).value,
  );

  const assembledDaysJSEND = await getAssembledDaysByIds(dayIds);

  const hasError = assembledDaysJSEND.status !== "success";

  return (
    <PageWrapper>
      {hasError && (
        <ErrorBox>
          {assembledDaysJSEND.data?.message ||
            "Ocurrió un error al cargar las comidas. Por favor, intenta de nuevo."}
        </ErrorBox>
      )}
      {!hasError && <MealsDisplay assembledDays={assembledDaysJSEND.data} />}
    </PageWrapper>
  );
}
