import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';
import { describe, it, expect, beforeEach} from 'vitest';
import { TaskFormData, Task } from '../types';

describe('useTasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('addTask should correctly clamp numeric fields and sanitize types', () => {
    const { result } = renderHook(() => useTasks());

    act(() => {
      const payload: unknown = {
        title: 12345, // should be converted to string
        domain: 'Grana',
        impact: 10, // should clamp to 5
        urgency: -2, // should clamp to 1
        emotionalCost: 100, // should clamp to 5
        emotionalType: 'Outro',
        size: 'Média',
        deadline: null, // should be omitted or handled
        tags: 'not-an-array', // should become []
      };
      result.current.addTask(payload as TaskFormData);
    });

    const tasks = result.current.tasks;
    const newTask = tasks[0];

    expect(newTask.title).toBe('12345');
    expect(newTask.impact).toBe(5);
    expect(newTask.urgency).toBe(1);
    expect(newTask.emotionalCost).toBe(5);
    expect(newTask.tags).toEqual([]);
    expect(newTask.status).toBe('inbox');
  });

  it('updateTask should correctly clamp numeric fields and not allow overwriting protected fields', () => {
    const { result } = renderHook(() => useTasks());

    const firstTask = result.current.tasks[0];
    const originalId = firstTask.id;
    const originalStatus = firstTask.status;

    act(() => {
      const payload: unknown = {
        impact: 10, // should clamp to 5
        urgency: -5, // should clamp to 1
        id: 'hacked-id', // should be ignored
        status: 'concluida', // should be ignored
        title: 999 // should become "999"
      };
      result.current.updateTask(originalId, payload as Partial<Task>);
    });

    const updatedTask = result.current.tasks.find((t) => t.id === originalId);

    expect(updatedTask).toBeDefined();
    if (updatedTask) {
      expect(updatedTask.id).toBe(originalId);
      expect(updatedTask.status).toBe(originalStatus);
      expect(updatedTask.impact).toBe(5);
      expect(updatedTask.urgency).toBe(1);
      expect(updatedTask.title).toBe('999');
    }
  });
});
