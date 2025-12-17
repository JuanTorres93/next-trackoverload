import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { WorkoutTemplateLineDTO } from '@/application-layer/dtos/WorkoutTemplateLineDTO';
import { WorkoutTemplateDTO } from '@/application-layer/dtos/WorkoutTemplateDTO';
import fs from 'fs/promises';
import path from 'path';

export class FileSystemWorkoutTemplatesRepo implements WorkoutTemplatesRepo {
  private readonly templatesDir: string;
  private readonly templateLinesDir: string;

  constructor(
    templatesBaseDir: string = './data/workouttemplates',
    templateLinesBaseDir: string = './data/workouttemplatelines'
  ) {
    this.templatesDir = templatesBaseDir;
    this.templateLinesDir = templateLinesBaseDir;
  }

  private async ensureDataDirs(): Promise<void> {
    try {
      await fs.mkdir(this.templatesDir, { recursive: true });
      await fs.mkdir(this.templateLinesDir, { recursive: true });
    } catch {
      // Directories might already exist
    }
  }

  private getTemplateFilePath(id: string): string {
    return path.join(this.templatesDir, `${id}.json`);
  }

  private getTemplateLineFilePath(id: string): string {
    return path.join(this.templateLinesDir, `${id}.json`);
  }

  private serializeTemplateLine(
    line: WorkoutTemplateLine
  ): WorkoutTemplateLineDTO {
    return {
      id: line.id,
      templateId: line.templateId,
      exerciseId: line.exerciseId,
      sets: line.sets,
      createdAt: line.createdAt.toISOString(),
      updatedAt: line.updatedAt.toISOString(),
    };
  }

  private deserializeTemplateLine(
    data: WorkoutTemplateLineDTO
  ): WorkoutTemplateLine {
    return WorkoutTemplateLine.create({
      id: data.id,
      templateId: data.templateId,
      exerciseId: data.exerciseId,
      sets: data.sets,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  private serializeTemplate(template: WorkoutTemplate): WorkoutTemplateDTO {
    return {
      id: template.id,
      userId: template.userId,
      name: template.name,
      exercises: template.exercises.map((line) =>
        this.serializeTemplateLine(line)
      ),
      isDeleted: template.isDeleted,
      createdAt: template.createdAt.toISOString(),
      updatedAt: template.updatedAt.toISOString(),
      deletedAt: template.deletedAt?.toISOString(),
    };
  }

  private deserializeTemplate(data: WorkoutTemplateDTO): WorkoutTemplate {
    return WorkoutTemplate.create({
      id: data.id,
      userId: data.userId,
      name: data.name,
      exercises: data.exercises.map((lineData) =>
        this.deserializeTemplateLine(lineData)
      ),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      deletedAt: data.deletedAt ? new Date(data.deletedAt) : undefined,
    });
  }

  async saveWorkoutTemplate(workoutTemplate: WorkoutTemplate): Promise<void> {
    await this.ensureDataDirs();
    const data = this.serializeTemplate(workoutTemplate);
    const filePath = this.getTemplateFilePath(workoutTemplate.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Save template lines separately
    for (const line of workoutTemplate.exercises) {
      const lineData = this.serializeTemplateLine(line);
      const lineFilePath = this.getTemplateLineFilePath(line.id);
      await fs.writeFile(lineFilePath, JSON.stringify(lineData, null, 2));
    }
  }

  async getAllWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    await this.ensureDataDirs();

    try {
      const files = await fs.readdir(this.templatesDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const templates = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.templatesDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as WorkoutTemplateDTO;
          return this.deserializeTemplate(data);
        })
      );

      return templates;
    } catch {
      return [];
    }
  }

  async getAllWorkoutTemplatesByUserId(
    userId: string
  ): Promise<WorkoutTemplate[]> {
    const allTemplates = await this.getAllWorkoutTemplates();
    return allTemplates.filter((template) => template.userId === userId);
  }

  async getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
    const filePath = this.getTemplateFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as WorkoutTemplateDTO;
      return this.deserializeTemplate(data);
    } catch {
      return null;
    }
  }

  async getWorkoutTemplateByIdAndUserId(
    id: string,
    userId: string
  ): Promise<WorkoutTemplate | null> {
    const template = await this.getWorkoutTemplateById(id);
    if (template && template.userId === userId) {
      return template;
    }
    return null;
  }

  async deleteAllWorkoutTemplatesForUser(userId: string): Promise<void> {
    const allTemplates = await this.getAllWorkoutTemplates();
    const userTemplates = allTemplates.filter((t) => t.userId === userId);

    await Promise.all(
      userTemplates.map(async (template) => {
        const filePath = this.getTemplateFilePath(template.id);
        try {
          await fs.unlink(filePath);
          // Delete associated template lines
          for (const line of template.exercises) {
            const lineFilePath = this.getTemplateLineFilePath(line.id);
            try {
              await fs.unlink(lineFilePath);
            } catch {
              // Line file might not exist
            }
          }
        } catch {
          // Template file might not exist
        }
      })
    );
  }
}
