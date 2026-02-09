import { ExerciseCreateProps } from '@/domain/entities/exercise/Exercise';
import {
  WorkoutTemplateLine,
  WorkoutTemplateLineCreateProps,
} from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import {
  WorkoutTemplate,
  WorkoutTemplateCreateProps,
} from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { withTransaction } from './common/withTransaction';
import WorkoutTemplateLineMongo from './models/WorkoutTemplateLineMongo';
import WorkoutTemplateMongo from './models/WorkoutTemplateMongo';

// Type for workout template line document populated with exercise
type PopulatedTemplateLineDoc = Omit<
  WorkoutTemplateLineCreateProps,
  'exercise'
> & {
  exerciseId: string;
  exercise?: ExerciseCreateProps;
};

// Type for workout template document populated with template lines and exercises
type PopulatedTemplateDoc = Omit<WorkoutTemplateCreateProps, 'exercises'> & {
  templateLines?: PopulatedTemplateLineDoc[];
};

export class MongoWorkoutTemplatesRepo implements WorkoutTemplatesRepo {
  async saveWorkoutTemplate(template: WorkoutTemplate): Promise<void> {
    const templateData = template.toCreateProps();

    await withTransaction(async (session) => {
      await WorkoutTemplateMongo.findOneAndUpdate(
        { id: template.id },
        templateData,
        {
          upsert: true,
          new: true,
          session,
        },
      );

      // Delete existing template lines for this template first
      await WorkoutTemplateLineMongo.deleteMany(
        { templateId: template.id },
        { session },
      );

      // Save new template lines
      const templateLines = template.exercises.map((line) => ({
        ...line.toCreateProps(),
        templateId: template.id,
      }));

      if (templateLines.length > 0) {
        await WorkoutTemplateLineMongo.insertMany(templateLines, { session });
      }
    });
  }

  async getAllWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    const templateDocs = await WorkoutTemplateMongo.find({})
      .populate({
        path: 'templateLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return this.toWorkoutTemplateEntities(templateDocs);
  }

  async getAllWorkoutTemplatesByUserId(
    userId: string,
  ): Promise<WorkoutTemplate[]> {
    const templateDocs = await WorkoutTemplateMongo.find({ userId })
      .populate({
        path: 'templateLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return this.toWorkoutTemplateEntities(templateDocs);
  }

  async getWorkoutTemplateById(id: string): Promise<WorkoutTemplate | null> {
    const doc = await WorkoutTemplateMongo.findOne({ id })
      .populate({
        path: 'templateLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return doc ? this.toWorkoutTemplateEntity(doc) : null;
  }

  async getWorkoutTemplateByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<WorkoutTemplate | null> {
    const doc = await WorkoutTemplateMongo.findOne({ id, userId })
      .populate({
        path: 'templateLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return doc ? this.toWorkoutTemplateEntity(doc) : null;
  }

  async deleteAllWorkoutTemplatesForUser(userId: string): Promise<void> {
    const templateDocs = await WorkoutTemplateMongo.find({ userId })
      .select('id')
      .lean();
    const templateIds = templateDocs.map((doc) => doc.id);

    await withTransaction(async (session) => {
      // Delete templates
      await WorkoutTemplateMongo.deleteMany({ userId }, { session });

      // Delete associated template lines
      if (templateIds.length > 0) {
        await WorkoutTemplateLineMongo.deleteMany(
          { templateId: { $in: templateIds } },
          { session },
        );
      }
    });
  }

  private toWorkoutTemplateEntity(
    doc: PopulatedTemplateDoc,
  ): WorkoutTemplate | null {
    if (!doc.templateLines || doc.templateLines.length === 0) {
      return null;
    }

    const exercises = doc.templateLines
      .filter((line) => line.exercise)
      .map((line) => WorkoutTemplateLine.create(line));

    if (exercises.length === 0) {
      return null;
    }

    return WorkoutTemplate.create({
      id: doc.id,
      userId: doc.userId,
      name: doc.name,
      exercises,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt,
    });
  }

  private toWorkoutTemplateEntities(
    docs: PopulatedTemplateDoc[],
  ): WorkoutTemplate[] {
    return docs
      .map((doc) => this.toWorkoutTemplateEntity(doc))
      .filter((template): template is WorkoutTemplate => template !== null);
  }
}
