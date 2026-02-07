import { Task, StorageData, CURRENT_SCHEMA_VERSION } from '../../types';
import { loadFromStorage, saveToStorage } from '../../utils/migration';
import { StorageAdapter } from './StorageAdapter';

const STORAGE_KEY = 'zen-productivity-tasks';

export class LocalStorageAdapter implements StorageAdapter {
  async loadTasks(): Promise<Task[]> {
    const tasks = loadFromStorage(STORAGE_KEY);
    return tasks || [];
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    const data: StorageData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks,
    };
    saveToStorage(STORAGE_KEY, data);
  }

  async addTask(task: Task): Promise<void> {
    const tasks = await this.loadTasks();
    tasks.unshift(task);
    await this.saveTasks(tasks);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const tasks = await this.loadTasks();
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );
    await this.saveTasks(updatedTasks);
  }

  async deleteTask(id: string): Promise<void> {
    const tasks = await this.loadTasks();
    const filtered = tasks.filter((task) => task.id !== id);
    await this.saveTasks(filtered);
  }
}
