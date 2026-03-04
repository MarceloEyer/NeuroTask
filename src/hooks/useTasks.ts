import { useState, useEffect } from 'react';
import { Task, TaskFormData, Status, ChecklistItem, Domain, Size, EmotionalType, Tag } from '../types';
import { calculatePriority } from '../utils/priority';

const STORAGE_KEY = 'zen-productivity-tasks';

export const MAX_IMPORT_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_TASKS = 1000;


const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Forzouk – discriminar serviços + notas',
    domain: 'Grana',
    impact: 5,
    urgency: 4,
    emotionalCost: 4,
    emotionalType: 'Cobrança',
    size: 'Média',
    tags: [],
    status: 'inbox',
    checklist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Agendar Espaço Laser',
    domain: 'Vida',
    impact: 2,
    urgency: 3,
    emotionalCost: 1,
    size: 'Pequena',
    tags: ['RÁPIDO 5min'],
    status: 'inbox',
    checklist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Verificar FGC',
    domain: 'Grana',
    impact: 3,
    urgency: 2,
    emotionalCost: 1,
    size: 'Pequena',
    tags: ['RÁPIDO 5min'],
    status: 'inbox',
    checklist: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Reembolso Fever',
    domain: 'Grana',
    impact: 3,
    urgency: 5,
    emotionalCost: 2,
    size: 'Pequena',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tags: [],
    status: 'inbox',
    checklist: [],
    createdAt: new Date().toISOString(),
  },
];


export const parseTask = (task: Record<string, unknown>): Task | null => {
  if (!task || typeof task !== 'object' || Array.isArray(task)) return null;

  // Essential fields checks
  if (
    typeof task.id !== 'string' ||
    typeof task.title !== 'string' ||
    typeof task.domain !== 'string' ||
    typeof task.size !== 'string' ||
    typeof task.status !== 'string' ||
    typeof task.createdAt !== 'string'
  ) {
    return null;
  }

  // Sanitize checklist
  let sanitizedChecklist: ChecklistItem[] = [];
  if (Array.isArray(task.checklist)) {
    sanitizedChecklist = task.checklist.reduce((acc: ChecklistItem[], item: Record<string, unknown>) => {
      if (
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        typeof item.completed === 'boolean'
      ) {
        acc.push({
          id: item.id,
          text: item.text,
          completed: item.completed,
        });
      }
      return acc;
    }, []);
  }

  // Sanitize tags
  let sanitizedTags: Tag[] = [];
  if (Array.isArray(task.tags)) {
    sanitizedTags = (task.tags as unknown[]).filter((tag): tag is Tag => typeof tag === 'string');
  }

  return {
    id: task.id,
    title: task.title,
    domain: task.domain as Domain,
    impact: Math.min(Math.max(Number(task.impact) || 1, 1), 5),
    urgency: Math.min(Math.max(Number(task.urgency) || 1, 1), 5),
    emotionalCost: Math.min(Math.max(Number(task.emotionalCost) || 1, 1), 5),
    emotionalType: typeof task.emotionalType === 'string' ? (task.emotionalType as EmotionalType) : undefined,
    size: task.size as Size,
    deadline: typeof task.deadline === 'string' ? task.deadline : undefined,
    tags: sanitizedTags,
    status: task.status as Status,
    checklist: sanitizedChecklist,
    createdAt: task.createdAt,
    completedAt: typeof task.completedAt === 'string' ? task.completedAt : undefined,
    deferReason: typeof task.deferReason === 'string' ? task.deferReason : undefined,
  };
};


export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return seedTasks;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...formData,
      status: 'inbox',
      checklist: [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const moveToStatus = (id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          if (status === 'concluida') {
            return { ...task, status, completedAt: new Date().toISOString() };
          }
          return { ...task, status };
        }
        return task;
      })
    );
  };

  const addChecklistItem = (taskId: string, text: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newItem: ChecklistItem = {
            id: Date.now().toString(),
            text,
            completed: false,
          };
          return { ...task, checklist: [...task.checklist, newItem] };
        }
        return task;
      })
    );
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklist: task.checklist.map((item) =>
              item.id === itemId ? { ...item, completed: !item.completed } : item
            ),
          };
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zen-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importData = (jsonData: string) => {
    try {
      const imported = JSON.parse(jsonData);
      if (Array.isArray(imported)) {
        if (imported.length > MAX_TASKS) {
          alert('Erro: O arquivo excede o limite máximo de ' + MAX_TASKS + ' tarefas.');
          return;
        }

        const validTasks = imported
          .map(parseTask)
          .filter((task): task is Task => task !== null);

        if (validTasks.length > 0) {
          setTasks(validTasks);
          alert('Dados importados com sucesso! ' + validTasks.length + ' tarefas válidas carregadas.');
        } else {
          alert('Erro: Nenhuma tarefa válida encontrada no arquivo.');
        }
      } else {
        alert('Erro: Formato de arquivo inválido. É esperado um array de tarefas.');
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      alert('Erro ao processar o arquivo. Verifique se o formato está correto.');
    }
  };

  const getTasksByStatus = (status: Status) => {
    return tasks.filter((task) => task.status === status);
  };

  const getRecommendedTasks = () => {
    const activeTasks = tasks.filter(
      (task) => task.status !== 'concluida' && task.status !== 'adiada' && task.status !== 'inbox'
    );

    return activeTasks
      .map((task) => ({
        task,
        priority: calculatePriority(task),
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5)
      .map((item) => item.task);
  };

  return {
    tasks,
    addTask,
    updateTask,
    moveToStatus,
    addChecklistItem,
    toggleChecklistItem,
    deleteTask,
    exportData,
    importData,
    getTasksByStatus,
    getRecommendedTasks,
  };
}
