import { DayEntry, JSENDResponse } from "shared";

import { handleJSENDResponse } from "@/app/_features/common/handleJSENDResponse";
import WeightProgress from "@/app/_features/dashboard/WeightProgress";
import { getLastNumberOfDaysIncludingTodayAndNonExistingDays } from "@/app/_features/day/actions";
import DailyGoals from "@/app/_features/weight/redesign/DailyGoals";
import UpdateTodaysWeight from "@/app/_features/weight/redesign/UpdateTodaysWeight";
import Screen from "@/app/_ui/screen/Screen";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Progreso de peso",
  description: "Seguimiento de tu progreso de peso",
};

export default async function WeightPage() {
  const promises: [Promise<JSENDResponse<DayEntry[]>>] = [
    getLastNumberOfDaysIncludingTodayAndNonExistingDays(90),
  ];

  const [last90DaysResponse] = await Promise.all(promises);

  const handledLast90Days = handleJSENDResponse(last90DaysResponse);

  const last90Days = handledLast90Days.isSuccess ? handledLast90Days.data : [];
  const last30Days = last90Days!.slice(-30);
  const last14Days = last90Days!.slice(-14);

  return (
    <Screen title="Progreso de peso">
      <div className="flex flex-col gap-6.25 pb-35">
        <UpdateTodaysWeight />

        <DailyGoals />

        {handledLast90Days.isSuccess && (
          <WeightProgress
            daysShortTerm={last14Days}
            daysMediumTerm={last30Days}
            daysLongTerm={handledLast90Days.data || []}
          />
        )}
      </div>
    </Screen>
  );
}
