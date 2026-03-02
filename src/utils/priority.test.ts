import { describe, it, expect } from 'vitest';
import { suggestNextAction } from './priority';
import { Task, EmotionalType } from '../types';

describe('suggestNextAction', () => {
  const createMockTask = (emotionalType?: EmotionalType): Task => ({
    id: '1',
    title: 'Test Task',
    domain: 'Urgente/Agora',
    impact: 3,
    urgency: 3,
    emotionalCost: 3,
    emotionalType,
    size: 'Média',
    tags: [],
    status: 'inbox',
    checklist: [],
    createdAt: new Date().toISOString()
  });

  it('should return the correct action for Cobrança', () => {
    const task = createMockTask('Cobrança');
    expect(suggestNextAction(task)).toBe('Próxima ação (2 min): Rascunhar mensagem de cobrança educada');
  });

  it('should return the correct action for Conflito', () => {
    const task = createMockTask('Conflito');
    expect(suggestNextAction(task)).toBe('Próxima ação (2 min): Anotar pontos principais para conversa');
  });

  it('should return the correct action for Conversa difícil', () => {
    const task = createMockTask('Conversa difícil');
    expect(suggestNextAction(task)).toBe('Próxima ação (2 min): Definir objetivo da conversa');
  });

  it('should return null for Outro', () => {
    const task = createMockTask('Outro');
    expect(suggestNextAction(task)).toBeNull();
  });

  it('should return null when emotionalType is undefined', () => {
    const task = createMockTask();
    expect(suggestNextAction(task)).toBeNull();
  });
});
