import { useState, useEffect } from 'react';
import { Task, TaskFormData, Status, ChecklistItem } from '../types';
import { calculatePriority } from '../utils/priority';

const STORAGE_KEY = 'zen-productivity-tasks';

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
        setTasks(imported);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
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
