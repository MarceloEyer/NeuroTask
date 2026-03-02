import { Task } from '../types';

export function calculatePriority(task: Task): number {
  let priority = (task.impact * 2) + task.urgency - task.emotionalCost;

  if (task.domain === 'Grana') {
    priority += 2;
  }

  if (task.deadline) {
    const daysUntilDeadline = Math.ceil(
      (new Date(task.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDeadline <= 3 && daysUntilDeadline >= 0) {
      priority += 2;
    }
  }

  return priority;
}

export function getTaskIcon(task: Task): string {
  const icons: string[] = [];

  if (task.impact >= 4) icons.push('💰');
  if (task.urgency >= 4) icons.push('⏰');
  if (task.emotionalCost >= 4) icons.push('🧠');
  if (task.tags.includes('RÁPIDO 5min')) icons.push('⚡');

  return icons.join(' ');
}

export function getDaysUntilDeadline(deadline?: string): number | null {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function shouldBreakDown(task: Task): boolean {
  return task.size === 'Grande' && task.checklist.length === 0;
}

export function suggestNextAction(task: Task): string | null {
  if (task.emotionalType === 'Cobrança') {
    return 'Próxima ação (2 min): Rascunhar mensagem de cobrança educada';
  }
  if (task.emotionalType === 'Conflito') {
    return 'Próxima ação (2 min): Anotar pontos principais para conversa';
  }
  if (task.emotionalType === 'Conversa difícil') {
    return 'Próxima ação (2 min): Definir objetivo da conversa';
  }
  return null;
}

export function getMessageTemplate(emotionalType?: string): string {
  if (emotionalType === 'Cobrança') {
    return 'Olá [nome],\n\nEspero que esteja bem. Gostaria de verificar o status de [assunto]. Podemos alinhar isso?\n\nAbraço,\nZen';
  }
  return '';
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks]
    .map((task) => ({ task, priority: calculatePriority(task) }))
    .sort((a, b) => b.priority - a.priority)
    .map((item) => item.task);
}
