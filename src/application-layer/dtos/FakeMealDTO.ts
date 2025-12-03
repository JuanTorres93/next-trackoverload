import { FakeMeal } from '@/domain/entities/fakemeal/FakeMeal';

export type FakeMealDTO = {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number;
  createdAt: string;
  updatedAt: string;
};

export function toFakeMealDTO(fakeMeal: FakeMeal): FakeMealDTO {
  return {
    id: fakeMeal.id,
    userId: fakeMeal.userId,
    name: fakeMeal.name,
    calories: fakeMeal.calories,
    protein: fakeMeal.protein,
    createdAt: fakeMeal.createdAt.toISOString(),
    updatedAt: fakeMeal.updatedAt.toISOString(),
  };
}

export function fromFakeMealDTO(dto: FakeMealDTO): FakeMeal {
  return FakeMeal.create({
    id: dto.id,
    userId: dto.userId,
    name: dto.name,
    calories: dto.calories,
    protein: dto.protein,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
