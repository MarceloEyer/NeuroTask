const fs = require('fs');
const file = 'src/hooks/useTasks.ts';
let code = fs.readFileSync(file, 'utf8');

const isValidTaskCode = `function isValidTask(task: unknown): task is Task {
  if (!task || typeof task !== 'object') return false;

  const t = task as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    ['Urgente/Agora', 'DJ & Carreira', 'Grana', 'Vida', 'Incubadora'].includes(t.domain as string) &&
    typeof t.impact === 'number' &&
    typeof t.urgency === 'number' &&
    typeof t.emotionalCost === 'number' &&
    ['Pequena', 'Média', 'Grande'].includes(t.size as string) &&
    Array.isArray(t.tags) &&
    ['inbox', 'agora', 'em_andamento', 'recomendadas', 'concluida', 'adiada'].includes(t.status as string) &&
    Array.isArray(t.checklist) &&
    typeof t.createdAt === 'string'
  );
}`;

code = code.replace(/function isValidTask[\s\S]*?;\n}/m, isValidTaskCode);

fs.writeFileSync(file, code);
