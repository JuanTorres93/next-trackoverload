import { promises as fs } from 'fs';
import { join } from 'path';

export abstract class BaseFileSystemRepo<T> {
  protected readonly dataDir: string;
  protected readonly fileName: string;

  constructor(fileName: string) {
    this.dataDir = join(process.cwd(), 'data');
    this.fileName = fileName;
  }

  protected get filePath(): string {
    return join(this.dataDir, this.fileName);
  }

  protected async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  protected async readData(): Promise<T[]> {
    await this.ensureDataDirectory();

    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(data);
      return this.deserializeItems(parsed);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }
      throw error;
    }
  }

  protected async writeData(items: T[]): Promise<void> {
    await this.ensureDataDirectory();
    const serialized = this.serializeItems(items);
    await fs.writeFile(this.filePath, JSON.stringify(serialized, null, 2));
  }

  protected abstract serializeItems(items: T[]): unknown[];
  protected abstract deserializeItems(data: unknown[]): T[];
  protected abstract getItemId(item: T): string;

  protected async saveItem(item: T): Promise<void> {
    const items = await this.readData();
    const existingIndex = items.findIndex(
      (existing) => this.getItemId(existing) === this.getItemId(item)
    );

    if (existingIndex !== -1) {
      items[existingIndex] = item;
    } else {
      items.push(item);
    }

    await this.writeData(items);
  }

  protected async saveMultipleItems(newItems: T[]): Promise<void> {
    const existingItems = await this.readData();

    // Create a map for faster lookups
    const existingItemsMap = new Map<string, number>();
    existingItems.forEach((item, index) => {
      existingItemsMap.set(this.getItemId(item), index);
    });

    // Process each new item
    newItems.forEach((newItem) => {
      const itemId = this.getItemId(newItem);
      const existingIndex = existingItemsMap.get(itemId);

      if (existingIndex !== undefined) {
        // Update existing item
        existingItems[existingIndex] = newItem;
      } else {
        // Add new item
        existingItems.push(newItem);
        existingItemsMap.set(itemId, existingItems.length - 1);
      }
    });

    await this.writeData(existingItems);
  }

  protected async getAllItems(): Promise<T[]> {
    return this.readData();
  }

  protected async getItemById(id: string): Promise<T | null> {
    const items = await this.readData();
    return items.find((item) => this.getItemId(item) === id) || null;
  }

  protected async deleteItemById(id: string): Promise<void> {
    const items = await this.readData();
    const index = items.findIndex((item) => this.getItemId(item) === id);

    if (index === -1) {
      return Promise.reject(null);
    }

    items.splice(index, 1);
    await this.writeData(items);
  }

  protected async deleteMultipleItems(ids: string[]): Promise<void> {
    const items = await this.readData();

    // Create a Set for faster lookups
    const idsToDelete = new Set(ids);

    // Filter out items that should be deleted
    const remainingItems = items.filter(
      (item) => !idsToDelete.has(this.getItemId(item))
    );

    await this.writeData(remainingItems);
  }
}
