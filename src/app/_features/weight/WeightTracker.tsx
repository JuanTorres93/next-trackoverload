import { DayEntry } from '@/application-layer/use-cases/day/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDays/GetLastNumberOfDaysForUserIncludingTodayAndNonExistentDaysUsecase';

function WeightTracker({ days }: { days: DayEntry[] }) {
  return (
    <div>
      <WeightInput />
      <WeightHistory />
    </div>
  );
}

function WeightInput() {
  return <div>Input peso</div>;
}

function WeightHistory() {
  return <div>History</div>;
}

export default WeightTracker;
