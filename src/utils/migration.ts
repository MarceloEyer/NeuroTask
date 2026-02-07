import { Task, Domain, LegacyDomain, StorageData, CURRENT_SCHEMA_VERSION } from '../types';

export function migrateLegacyDomain(legacyDomain: string): Domain {
  const mapping: Record<LegacyDomain, Domain> = {
    'DJ & Carreira': 'Trabalho',
    'Grana': 'Finanças',
    'Vida': 'Pessoal',
    'Incubadora': 'Projetos',
    'Urgente/Agora': 'Admin',
  };

  return mapping[legacyDomain as LegacyDomain] || 'Pessoal';
}

export function migrateTask(task: any): Task {
  const migratedTask = { ...task };

  if (!isValidDomain(task.domain)) {
    migratedTask.domain = migrateLegacyDomain(task.domain);
  }

  if (!task.createdAt) {
    migratedTask.createdAt = new Date().toISOString();
  }

  return migratedTask as Task;
}

function isValidDomain(domain: string): domain is Domain {
  const validDomains: Domain[] = [
    'Trabalho',
    'Finanças',
    'Saúde',
    'Casa',
    'Relacionamentos',
    'Pessoal',
    'Aprendizado',
    'Projetos',
    'Admin',
  ];
  return validDomains.includes(domain as Domain);
}

export function migrateStorageData(data: any): StorageData {
  if (Array.isArray(data)) {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks: data.map(migrateTask),
    };
  }

  if (data.schemaVersion === undefined || data.schemaVersion < CURRENT_SCHEMA_VERSION) {
    const tasks = data.tasks || data;
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks: Array.isArray(tasks) ? tasks.map(migrateTask) : [],
    };
  }

  return data as StorageData;
}

export function loadFromStorage(key: string): Task[] | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const migrated = migrateStorageData(parsed);

    saveToStorage(key, migrated);

    return migrated.tasks;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
}

export function saveToStorage(key: string, data: StorageData): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to storage:', error);
  }
}
