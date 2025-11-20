import { FileSystemIngredientLinesRepo } from '@/infra/filesystem';
import { MemoryIngredientLinesRepo } from '@/infra/memory/MemoryIngredientLinesRepo';

let AppIngredientLinesRepo:
  | FileSystemIngredientLinesRepo
  | MemoryIngredientLinesRepo;

if (process.env.NODE_ENV === 'test') {
  AppIngredientLinesRepo = new MemoryIngredientLinesRepo();
} else {
  AppIngredientLinesRepo = new FileSystemIngredientLinesRepo();
}

export { AppIngredientLinesRepo };
