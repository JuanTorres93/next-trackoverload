import { Day } from '@/domain/entities/day/Day';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import DayMongo, { DayMongoProps } from './models/DayMongo';

export class MongoDaysRepo implements DaysRepo {
  async saveDay(day: Day): Promise<void> {
    const dayData = {
      ...day.toCreateProps(),
      mealIds: day.mealIds,
      fakeMealIds: day.fakeMealIds,
    };

    await DayMongo.findOneAndUpdate(
      { day: day.day, month: day.month, year: day.year, userId: day.userId },
      dayData,
      {
        upsert: true,
        new: true,
      },
    );
  }

  async getAllDays(): Promise<Day[]> {
    const dayDocs = await DayMongo.find({}).lean({ virtuals: true });

    return dayDocs.map((doc) => this.toDayEntity(doc));
  }

  async getAllDaysByUserId(userId: string): Promise<Day[]> {
    const dayDocs = await DayMongo.find({ userId }).lean({ virtuals: true });

    return dayDocs.map((doc) => this.toDayEntity(doc));
  }

  async getDayById(id: string): Promise<Day | null> {
    // Parse the id (YYYYMMDD format) to get day, month, year
    const { year, month, day } = this.parseId(id);

    const doc = await DayMongo.findOne({ year, month, day }).lean({
      virtuals: true,
    });

    return doc ? this.toDayEntity(doc) : null;
  }

  async getDayByIdAndUserId(id: string, userId: string): Promise<Day | null> {
    // Parse the id (YYYYMMDD format) to get day, month, year
    const { year, month, day } = this.parseId(id);

    const doc = await DayMongo.findOne({ year, month, day, userId }).lean({
      virtuals: true,
    });

    return doc ? this.toDayEntity(doc) : null;
  }

  async getDaysByDateRange(
    startDayId: string,
    endDayId: string,
  ): Promise<Day[]> {
    const dayDocs = await DayMongo.find({}).lean({ virtuals: true });

    // Filter days that are within the range using the virtual 'id' field
    const filteredDocs = dayDocs.filter((doc) => {
      const dayId = this.getDayId(doc.year, doc.month, doc.day);
      return dayId >= startDayId && dayId <= endDayId;
    });

    return filteredDocs.map((doc) => this.toDayEntity(doc));
  }

  async getDaysByDateRangeAndUserId(
    startDayId: string,
    endDayId: string,
    userId: string,
  ): Promise<Day[]> {
    const dayDocs = await DayMongo.find({ userId }).lean({ virtuals: true });

    const filteredDocs = dayDocs.filter((doc) => {
      const dayId = this.getDayId(doc.year, doc.month, doc.day);
      return dayId >= startDayId && dayId <= endDayId;
    });

    return filteredDocs.map((doc) => this.toDayEntity(doc));
  }

  async deleteDayForUser(id: string, userId: string): Promise<void> {
    const { year, month, day } = this.parseId(id);

    await DayMongo.deleteOne({ year, month, day, userId });
  }

  async deleteAllDaysForUser(userId: string): Promise<void> {
    await DayMongo.deleteMany({ userId });
  }

  private toDayEntity(doc: DayMongoProps): Day {
    const day = Day.create(doc);

    // Add mealIds and fakeMealIds to the day
    doc.mealIds?.forEach((mealId: string) => {
      day.addMeal(mealId);
    });

    doc.fakeMealIds?.forEach((fakeMealId: string) => {
      day.addFakeMeal(fakeMealId);
    });

    return day;
  }

  private parseId(id: string): { year: number; month: number; day: number } {
    // Expected format: YYYYMMDD
    const year = parseInt(id.substring(0, 4), 10);
    const month = parseInt(id.substring(4, 6), 10);
    const day = parseInt(id.substring(6, 8), 10);

    return { year, month, day };
  }

  private getDayId(year: number, month: number, day: number): string {
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year);
    return `${yearStr}${monthStr}${dayStr}`;
  }
}
