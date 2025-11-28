import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemWorkoutTemplatesRepo
  extends BaseFileSystemRepo<WorkoutTemplate>
  implements WorkoutTemplatesRepo
{
  constructor() {
    super('workout-templates.json');
  }

  protected getItemId(item: WorkoutTemplate): string {
    return item.id;
  }

  protected serializeItems(items: WorkoutTemplate[]): WorkoutTemplateDTO[] {
    return items.map(toWorkoutTemplateDTO);
  }

  protected deserializeItems(data: unknown[]): WorkoutTemplate[] {
    return (data as WorkoutTemplateDTO[]).map((item) =>
      WorkoutTemplate.create({
        ...item,
        id: item.id,
        userId: item.userId,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        deletedAt: item.deletedAt ? new Date(item.deletedAt) : undefined,
      })
    );
  }

  async saveWorkoutTemplate(workoutTemplate: WorkoutTemplate): Promise<void> {
    return this.saveItem(workoutTemplate);
  }

  async getAllWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    return this.getAllItems();
  }

  async getAllWorkoutTemplatesByUserId(
    userId: string
  ): Promise<WorkoutTemplate[]> {
    const templates = await this.getAllItems();
    return templates.filter((template) => template.userId === userId);
  }

  async getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
    return this.getItemById(id);
  }

  async getWorkoutTemplateByIdAndUserId(
    id: string,
    userId: string
  ): Promise<WorkoutTemplate | null> {
    const template = await this.getItemById(id);
    return template && template.userId === userId ? template : null;
  }
}
