import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculatePriority } from '../priority';
import { Task } from '../../types';

describe('calculatePriority', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createBaseTask = (overrides: Partial<Task> = {}): Task => ({
    id: '1',
    title: 'Test Task',
    domain: 'Vida',
    impact: 3,
    urgency: 3,
    emotionalCost: 3,
    size: 'Média',
    tags: [],
    status: 'inbox',
    checklist: [],
    createdAt: new Date('2024-03-01T12:00:00Z').toISOString(),
    ...overrides
  });

  it('calculates base priority correctly: (impact * 2) + urgency - emotionalCost', () => {
    // (3 * 2) + 3 - 3 = 6
    const task1 = createBaseTask({ impact: 3, urgency: 3, emotionalCost: 3 });
    expect(calculatePriority(task1)).toBe(6);

    // (5 * 2) + 1 - 5 = 6
    const task2 = createBaseTask({ impact: 5, urgency: 1, emotionalCost: 5 });
    expect(calculatePriority(task2)).toBe(6);

    // (1 * 2) + 5 - 1 = 6
    const task3 = createBaseTask({ impact: 1, urgency: 5, emotionalCost: 1 });
    expect(calculatePriority(task3)).toBe(6);
  });

  it('adds 2 to priority if domain is Grana', () => {
    // Base: (3 * 2) + 3 - 3 = 6
    // Domain Grana: 6 + 2 = 8
    const task = createBaseTask({ domain: 'Grana' });
    expect(calculatePriority(task)).toBe(8);
  });

  describe('deadline modifier', () => {
    it('adds 2 to priority if deadline is today (0 days)', () => {
      // 0 days until deadline
      const task = createBaseTask({ deadline: '2024-03-01T12:00:00Z' });
      expect(calculatePriority(task)).toBe(8); // 6 + 2
    });

    it('adds 2 to priority if deadline is in 3 days', () => {
      // exactly 3 days from current time
      const task = createBaseTask({ deadline: '2024-03-04T12:00:00Z' });
      expect(calculatePriority(task)).toBe(8); // 6 + 2
    });

    it('adds 2 to priority if deadline is in 1 day', () => {
      const task = createBaseTask({ deadline: '2024-03-02T12:00:00Z' });
      expect(calculatePriority(task)).toBe(8); // 6 + 2
    });

    it('does NOT add 2 to priority if deadline is in 4 days', () => {
      const task = createBaseTask({ deadline: '2024-03-05T12:00:00Z' });
      expect(calculatePriority(task)).toBe(6); // base priority
    });

    it('does NOT add 2 to priority if deadline is in the past (< 0 days)', () => {
      const task = createBaseTask({ deadline: '2024-02-29T12:00:00Z' });
      expect(calculatePriority(task)).toBe(6); // base priority
    });

    it('handles both Grana domain and deadline modifiers together', () => {
      // Base: 6
      // Grana: +2
      // Deadline (in 2 days): +2
      // Total: 10
      const task = createBaseTask({
        domain: 'Grana',
        deadline: '2024-03-03T12:00:00Z'
      });
      expect(calculatePriority(task)).toBe(10);
    });
  });
});
