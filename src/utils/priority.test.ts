import { expect, test, describe } from 'vitest';
import { shouldBreakDown } from './priority';
import { Task } from '../types';

describe('shouldBreakDown', () => {
  const baseTask: Partial<Task> = {
    id: '1',
    title: 'Test Task',
    domain: 'Vida',
    impact: 3,
    urgency: 3,
    emotionalCost: 3,
    tags: [],
    status: 'inbox',
    createdAt: new Date().toISOString()
  };

  test('returns true when task is Grande and has no checklist items', () => {
    const task = { ...baseTask, size: 'Grande', checklist: [] } as Task;
    expect(shouldBreakDown(task)).toBe(true);
  });

  test('returns false when task is Grande but has checklist items', () => {
    const task = {
      ...baseTask,
      size: 'Grande',
      checklist: [{ id: '1', text: 'Step 1', completed: false }]
    } as Task;
    expect(shouldBreakDown(task)).toBe(false);
  });

  test('returns false when task is Média and has no checklist items', () => {
    const task = { ...baseTask, size: 'Média', checklist: [] } as Task;
    expect(shouldBreakDown(task)).toBe(false);
  });

  test('returns false when task is Pequena and has no checklist items', () => {
    const task = { ...baseTask, size: 'Pequena', checklist: [] } as Task;
    expect(shouldBreakDown(task)).toBe(false);
  });
});
