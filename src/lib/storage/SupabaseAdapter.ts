import { Task, ChecklistItem } from '../../types';
import { supabase } from '../supabase';
import { StorageAdapter } from './StorageAdapter';

interface DbTask {
  id: string;
  user_id: string;
  title: string;
  domain: string;
  impact: number;
  urgency: number;
  emotional_cost: number;
  emotional_type: string | null;
  size: string;
  deadline: string | null;
  tags: string[];
  status: string;
  checklist: ChecklistItem[];
  defer_reason: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

function dbTaskToTask(dbTask: DbTask): Task {
  return {
    id: dbTask.id,
    title: dbTask.title,
    domain: dbTask.domain as Task['domain'],
    impact: dbTask.impact,
    urgency: dbTask.urgency,
    emotionalCost: dbTask.emotional_cost,
    emotionalType: dbTask.emotional_type as Task['emotionalType'],
    size: dbTask.size as Task['size'],
    deadline: dbTask.deadline || undefined,
    tags: dbTask.tags as Task['tags'],
    status: dbTask.status as Task['status'],
    checklist: dbTask.checklist,
    deferReason: dbTask.defer_reason || undefined,
    createdAt: dbTask.created_at,
    completedAt: dbTask.completed_at || undefined,
  };
}

function taskToDbTask(task: Task, userId: string): any {
  return {
    id: task.id,
    user_id: userId,
    title: task.title,
    domain: task.domain,
    impact: task.impact,
    urgency: task.urgency,
    emotional_cost: task.emotionalCost,
    emotional_type: task.emotionalType || null,
    size: task.size,
    deadline: task.deadline || null,
    tags: task.tags,
    status: task.status,
    checklist: task.checklist,
    defer_reason: task.deferReason || null,
    created_at: task.createdAt,
    completed_at: task.completedAt || null,
  };
}

export class SupabaseAdapter implements StorageAdapter {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async loadTasks(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tasks from Supabase:', error);
      throw error;
    }

    return (data || []).map(dbTaskToTask);
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', this.userId);

    if (deleteError) {
      console.error('Error deleting tasks:', deleteError);
      throw deleteError;
    }

    if (tasks.length === 0) return;

    const dbTasks = tasks.map((task) => taskToDbTask(task, this.userId));

    const { error: insertError } = await supabase.from('tasks').insert(dbTasks);

    if (insertError) {
      console.error('Error saving tasks to Supabase:', insertError);
      throw insertError;
    }
  }

  async addTask(task: Task): Promise<void> {
    const dbTask = taskToDbTask(task, this.userId);

    const { error } = await supabase.from('tasks').insert(dbTask);

    if (error) {
      console.error('Error adding task to Supabase:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const dbUpdates: any = {};

    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.domain !== undefined) dbUpdates.domain = updates.domain;
    if (updates.impact !== undefined) dbUpdates.impact = updates.impact;
    if (updates.urgency !== undefined) dbUpdates.urgency = updates.urgency;
    if (updates.emotionalCost !== undefined) dbUpdates.emotional_cost = updates.emotionalCost;
    if (updates.emotionalType !== undefined) dbUpdates.emotional_type = updates.emotionalType;
    if (updates.size !== undefined) dbUpdates.size = updates.size;
    if (updates.deadline !== undefined) dbUpdates.deadline = updates.deadline;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.checklist !== undefined) dbUpdates.checklist = updates.checklist;
    if (updates.deferReason !== undefined) dbUpdates.defer_reason = updates.deferReason;
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) {
      console.error('Error updating task in Supabase:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<void> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);

    if (error) {
      console.error('Error deleting task from Supabase:', error);
      throw error;
    }
  }
}
