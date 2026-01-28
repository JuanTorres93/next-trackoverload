import { DayDTO, toDayDTO } from '@/application-layer/dtos/DayDTO';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { createDayNoSaveInRepo } from '../common/createDayNoSaveInRepo';

export type CreateDayUsecaseRequest = {
  day: number;
  month: number;
  year: number;
  actorUserId: string;
  targetUserId: string;
};

export class CreateDayUsecase {
  constructor(
    private daysRepo: DaysRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: CreateDayUsecaseRequest): Promise<DayDTO> {
    const newDay = await createDayNoSaveInRepo(
      this.usersRepo,
      this.daysRepo,
      request,
    );

    await this.daysRepo.saveDay(newDay);

    return toDayDTO(newDay);
  }
}
