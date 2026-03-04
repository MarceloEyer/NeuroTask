import { describe, it, expect } from 'vitest';
import { parseTask, MAX_IMPORT_SIZE, MAX_TASKS } from './useTasks';


describe('useTasks Validation', () => {
  it('exports expected constants', () => {
    expect(MAX_IMPORT_SIZE).toBe(2 * 1024 * 1024);
    expect(MAX_TASKS).toBe(1000);
  });

  describe('parseTask', () => {
    it('returns null for invalid inputs', () => {
      expect(parseTask(null as never)).toBeNull();
      expect(parseTask(undefined as never)).toBeNull();
      expect(parseTask(123 as never)).toBeNull();
      expect(parseTask('string' as never)).toBeNull();
      expect(parseTask([] as never)).toBeNull();
      expect(parseTask({})).toBeNull(); // Missing required fields
    });

    it('parses and sanitizes a valid task', () => {
      const rawTask = {
        id: 'task-1',
        title: 'Valid Task',
        domain: 'Grana',
        impact: '10', // Should be clamped to 5
        urgency: -1,  // Should be clamped to 1
        emotionalCost: 3,
        size: 'Pequena',
        status: 'inbox',
        createdAt: '2023-10-01T12:00:00.000Z',
        tags: ['FOCO 1h', 123, null], // Invalid tags should be removed
        checklist: [
          { id: 'item-1', text: 'Item 1', completed: true },
          { id: 'item-2', text: 'Item 2' }, // Missing 'completed'
          null
        ],
        extraField: 'Should be ignored',
        __proto__: { polluted: true }
      };

      const parsed = parseTask(rawTask);

      expect(parsed).not.toBeNull();
      expect(parsed?.id).toBe('task-1');
      expect(parsed?.title).toBe('Valid Task');
      expect(parsed?.domain).toBe('Grana');
      expect(parsed?.impact).toBe(5); // Clamped
      expect(parsed?.urgency).toBe(1); // Clamped
      expect(parsed?.emotionalCost).toBe(3);
      expect(parsed?.size).toBe('Pequena');
      expect(parsed?.status).toBe('inbox');
      expect(parsed?.createdAt).toBe('2023-10-01T12:00:00.000Z');
      expect(parsed?.tags).toEqual(['FOCO 1h']); // Filtered
      expect(parsed?.checklist).toEqual([
        { id: 'item-1', text: 'Item 1', completed: true }
      ]); // Filtered
      expect(((parsed as unknown) as Record<string, unknown>).extraField).toBeUndefined(); // Ignored
      expect(((parsed as unknown) as Record<string, unknown>).polluted).toBeUndefined(); // Prototype pollution avoided by explicit construction
    });
  });
});
