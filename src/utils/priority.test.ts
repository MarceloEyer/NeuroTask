import { describe, it, expect } from 'vitest';
import { calculatePriority } from './priority';
import type { Task } from '../types';

describe('calculatePriority', () => {
  const baseTask: Task = {
    id: '1',
    title: 'Test Task',
    domain: 'Trabalho',
    impact: 3,
    urgency: 3,
    emotionalCost: 1,
    size: 'media',
    status: 'inbox',
    tags: [],
    checklist: [],
    createdAt: new Date().toISOString(),
  };

  it('calcula prioridade base corretamente', () => {
    const priority = calculatePriority(baseTask);
    expect(priority).toBe(8); // (3 * 2) + 3 - 1 = 8
  });

  it('aplica boost de Finanças', () => {
    const task = { ...baseTask, domain: 'Finanças' as const };
    const priority = calculatePriority(task);
    expect(priority).toBe(10); // (3 * 2) + 3 - 1 + 2 = 10
  });

  it('aplica boost de deadline (≤ 3 dias)', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);

    const task = { ...baseTask, deadline: tomorrow.toISOString() };
    const priority = calculatePriority(task);
    expect(priority).toBe(10); // (3 * 2) + 3 - 1 + 2 = 10
  });

  it('combina múltiplos boosts', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const task = {
      ...baseTask,
      domain: 'Finanças' as const,
      deadline: tomorrow.toISOString(),
      impact: 5,
      urgency: 4,
      emotionalCost: 2,
    };

    const priority = calculatePriority(task);
    expect(priority).toBe(16); // (5 * 2) + 4 - 2 + 2 + 2 = 16
  });
});
