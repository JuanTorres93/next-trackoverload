import { Day } from '@/domain/entities/day/Day';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { DayDTO, toDayDTO, fromDayDTO } from '@/application-layer/dtos/DayDTO';
import fs from 'fs/promises';
import path from 'path';

export class FileSystemDaysRepo implements DaysRepo {
  private readonly daysDir: string;

  constructor(baseDir: string = './data/days') {
    this.daysDir = baseDir;
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(this.daysDir, { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  private getFilePath(id: string): string {
    // Use ISO date string as filename
    const fileName = id; // YYYY-MM-DD
    return path.join(this.daysDir, `${fileName}.json`);
  }

  async saveDay(day: Day): Promise<void> {
    await this.ensureDataDir();
    const data = toDayDTO(day);
    const filePath = this.getFilePath(day.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async getAllDays(): Promise<Day[]> {
    await this.ensureDataDir();

    try {
      const files = await fs.readdir(this.daysDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const days = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.daysDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as DayDTO;
          return fromDayDTO(data);
        })
      );

      return days;
    } catch {
      return [];
    }
  }

  async getAllDaysByUserId(userId: string): Promise<Day[]> {
    const allDays = await this.getAllDays();
    return allDays.filter((day) => day.userId === userId);
  }

  async getDayById(id: string): Promise<Day | null> {
    const filePath = this.getFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as DayDTO;
      return fromDayDTO(data);
    } catch {
      return null;
    }
  }

  async getDayByIdAndUserId(id: string, userId: string): Promise<Day | null> {
    const day = await this.getDayById(id);
    if (day && day.userId === userId) {
      return day;
    }
    return null;
  }

  async getDaysByDateRange(
    startDayId: string,
    endDayId: string
  ): Promise<Day[]> {
    const allDays = await this.getAllDays();
    return allDays.filter((day) => {
      const dayTime = day.id;
      return dayTime >= startDayId && dayTime <= endDayId;
    });
  }

  async getDaysByDateRangeAndUserId(
    startDayId: string,
    endDayId: string,
    userId: string
  ): Promise<Day[]> {
    const allDays = await this.getAllDays();
    return allDays.filter((day) => {
      const dayTime = day.id;
      return (
        dayTime >= startDayId && dayTime <= endDayId && day.userId === userId
      );
    });
  }

  async deleteDayForUser(id: string, userId: string): Promise<void> {
    const day = await this.getDayById(id);

    if (day && day.userId === userId) {
      const filePath = this.getFilePath(id);
      try {
        await fs.unlink(filePath);
      } catch {
        // No error for non-existent days - consistent with other repos
      }
    }
  }

  async deleteAllDaysForUser(userId: string): Promise<void> {
    const allDays = await this.getAllDays();
    const userDays = allDays.filter((d) => d.userId === userId);

    await Promise.all(
      userDays.map(async (day) => {
        const filePath = this.getFilePath(day.id);
        try {
          await fs.unlink(filePath);
        } catch {
          // File might not exist
        }
      })
    );
  }
}
