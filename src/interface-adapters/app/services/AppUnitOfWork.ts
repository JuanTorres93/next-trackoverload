import { MemoryUnitOfWork } from '@/infra/unit-of-work/memoryUnitOfWork/MemoryUnitOfWork';

export const AppUnitOfWork = new MemoryUnitOfWork();
