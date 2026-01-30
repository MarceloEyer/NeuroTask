import { useState, useEffect } from 'react';
import { Task, TaskFormData, Status, ChecklistItem, StorageData, CURRENT_SCHEMA_VERSION } from '../types';
import { calculatePriority } from '../utils/priority';
import { shouldBreakDown } from '../utils/priority';
import { migrateStorageData } from '../utils/migration';
import { useAuth } from '../contexts/AuthContext';
import { StorageAdapter } from '../lib/storage/StorageAdapter';
import { LocalStorageAdapter } from '../lib/storage/LocalStorageAdapter';
import { SupabaseAdapter } from '../lib/storage/SupabaseAdapter';

const seedTasks: Task[] = [
  {
    id: '1',
    title: 'Forzouk – discriminar serviços + notas',
    domain: 'Finanças',
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
    domain: 'Pessoal',
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
    domain: 'Finanças',
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
    domain: 'Finanças',
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
  const { user, isConfigured } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [adapter, setAdapter] = useState<StorageAdapter>(() => new LocalStorageAdapter());

  useEffect(() => {
    if (isConfigured && user) {
      setAdapter(new SupabaseAdapter(user.id));
    } else {
      setAdapter(new LocalStorageAdapter());
    }
  }, [user, isConfigured]);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const loaded = await adapter.loadTasks();
        setTasks(loaded.length > 0 ? loaded : seedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks(seedTasks);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [adapter]);

  useEffect(() => {
    if (!loading && tasks.length > 0) {
      adapter.saveTasks(tasks).catch(console.error);
    }
  }, [tasks, adapter, loading]);

  const addTask = (formData: TaskFormData) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
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
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    if (status === 'agora') {
      const agoraTasks = tasks.filter((t) => t.status === 'agora');
      if (agoraTasks.length >= 2 && !agoraTasks.some((t) => t.id === id)) {
        console.warn('Limite de 2 tarefas em AGORA atingido');
        return;
      }
    }

    if (status === 'em_andamento') {
      const emAndamentoTasks = tasks.filter((t) => t.status === 'em_andamento');
      if (emAndamentoTasks.length >= 1 && !emAndamentoTasks.some((t) => t.id === id)) {
        console.warn('Limite de 1 tarefa em EM ANDAMENTO atingido');
        return;
      }

      if (shouldBreakDown(task)) {
        console.warn('Tarefa grande precisa ser quebrada antes de iniciar');
        return;
      }
    }

    if (status === 'concluida') {
      if (task.checklist.length > 0) {
        const allCompleted = task.checklist.every((item) => item.completed);
        if (!allCompleted) {
          console.warn('Complete todos os itens do checklist antes de concluir');
          return;
        }
      }
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          if (status === 'concluida') {
            return { ...t, status, completedAt: new Date().toISOString() };
          }
          return { ...t, status };
        }
        return t;
      })
    );
  };

  const addChecklistItem = (taskId: string, text: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newItem: ChecklistItem = {
            id: crypto.randomUUID(),
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
    const exportData: StorageData = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      tasks,
    };
    const dataStr = JSON.stringify(exportData, null, 2);
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
      const migrated = migrateStorageData(imported);
      setTasks(migrated.tasks);
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
    loading,
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
