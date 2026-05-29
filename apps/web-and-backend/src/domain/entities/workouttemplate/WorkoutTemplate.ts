import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError, ValidationError } from "../../common/errors";
import { DomainDate } from "../../value-objects/DomainDate/DomainDate";
import { Id } from "../../value-objects/Id/Id";
import { Integer } from "../../value-objects/Integer/Integer";
import { Text } from "../../value-objects/Text/Text";
import {
  WorkoutTemplateLine,
  WorkoutTemplateLineUpdateProps,
} from "../workouttemplateline/WorkoutTemplateLine";

export type WorkoutTemplateCreateProps = {
  id: string;
  userId: string;
  name: string;
  exercises: WorkoutTemplateLine[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type WorkoutTemplateUpdateProps = {
  name?: string;
};

export type WorkoutTemplateProps = {
  id: Id;
  userId: Id;
  name: Text;
  exercises: WorkoutTemplateLine[];
  createdAt: DomainDate;
  updatedAt: DomainDate;
  deletedAt?: Date;
};

export const nameTextOptions = {
  canBeEmpty: false,
  maxLength: Integer.create(100),
};
const exerciseIndexIntegerOptions = { onlyPositive: true };

export class WorkoutTemplate {
  private constructor(private readonly props: WorkoutTemplateProps) {}

  static create(props: WorkoutTemplateCreateProps): WorkoutTemplate {
    if (!Array.isArray(props.exercises)) {
      logNoTest("WorkoutTemplate exercises must be an array");

      throw new ValidationError("Los ejercicios deben ser un array.");
    }

    for (const line of props.exercises) {
      if (
        !line.exerciseId ||
        !line.sets ||
        typeof line.sets !== "number" ||
        line.sets <= 0
      ) {
        logNoTest(
          "WorkoutTemplate exercises must be instances of WorkoutTemplateLine",
        );

        throw new ValidationError(
          "Los ejercicios de la plantilla no son válidos.",
        );
      }
    }

    const workoutTemplateProps: WorkoutTemplateProps = {
      id: Id.create(props.id),
      userId: Id.create(props.userId),
      name: Text.create(props.name, nameTextOptions),
      exercises: props.exercises,
      createdAt: DomainDate.create(props.createdAt),
      updatedAt: DomainDate.create(props.updatedAt),
      deletedAt: props.deletedAt,
    };

    return new WorkoutTemplate(workoutTemplateProps);
  }

  addExercise(newWorkoutTemplateLine: WorkoutTemplateLine) {
    // NOTE: maybe allow duplicates in the future?
    const existingLine = this.props.exercises.find(
      (line) => line.exerciseId === newWorkoutTemplateLine.exerciseId,
    );
    if (existingLine) {
      logNoTest("WorkoutTemplate: Exercise already exists");

      throw new ValidationError("El ejercicio ya existe en la plantilla.");
    }
    this.props.exercises.push(newWorkoutTemplateLine);
  }

  removeExercise(exerciseId: string) {
    const existingLine = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId,
    );
    if (!existingLine) {
      logNoTest("WorkoutTemplate: Exercise to remove not found");

      throw new NotFoundError("El ejercicio no existe en la plantilla.");
    }

    this.props.exercises = this.props.exercises.filter(
      (line) => line.exerciseId !== exerciseId,
    );
  }

  reorderExercise(exerciseId: string, newIndex: number) {
    const validatedNewIndex = Integer.create(
      newIndex,
      exerciseIndexIntegerOptions,
    ).value;

    const exercise = this.props.exercises.find(
      (line) => line.exerciseId === exerciseId,
    );
    if (!exercise) {
      logNoTest("WorkoutTemplate: Exercise to reorder not found");

      throw new NotFoundError("El ejercicio no existe en la plantilla.");
    }

    this.props.exercises = this.props.exercises.filter(
      (line) => line.exerciseId !== exerciseId,
    );
    this.props.exercises.splice(validatedNewIndex, 0, exercise);
  }

  update(patch: WorkoutTemplateUpdateProps) {
    // or all are undefined
    if (
      !patch ||
      Object.keys(patch).length === 0 ||
      Object.values(patch).every((value) => value === undefined)
    ) {
      logNoTest("WorkoutTemplate: No update patch provided");

      throw new ValidationError(
        "No se han proporcionado datos para actualizar.",
      );
    }

    if (patch.name !== undefined) {
      this.props.name = Text.create(patch.name, nameTextOptions);
    }

    this.props.updatedAt = DomainDate.create();
  }

  updateExercise(
    exerciseId: string,
    updateProps: WorkoutTemplateLineUpdateProps,
  ) {
    const lineToUpdate: WorkoutTemplateLine | undefined =
      this.props.exercises.find((line) => line.exerciseId === exerciseId);

    if (!lineToUpdate) {
      logNoTest("WorkoutTemplate: Exercise to update not found");

      throw new NotFoundError("El ejercicio no existe en la plantilla.");
    }

    lineToUpdate.update(updateProps);
  }

  // Getters
  get id() {
    return this.props.id.value;
  }

  get userId() {
    return this.props.userId.value;
  }

  get name() {
    return this.props.name.value;
  }

  get exercises() {
    return [...this.props.exercises];
  }

  get createdAt() {
    return this.props.createdAt.value;
  }

  get updatedAt() {
    return this.props.updatedAt.value;
  }

  get deletedAt() {
    return this.props.deletedAt;
  }

  get isDeleted() {
    return this.props.deletedAt !== undefined;
  }

  markAsDeleted() {
    const now = new Date();
    this.props.deletedAt = now;
    this.props.updatedAt = DomainDate.create();
  }

  toCreateProps(): WorkoutTemplateCreateProps {
    return {
      id: this.props.id.value,
      userId: this.props.userId.value,
      name: this.props.name.value,
      exercises: this.props.exercises,
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt.value,
      deletedAt: this.props.deletedAt,
    };
  }
}
