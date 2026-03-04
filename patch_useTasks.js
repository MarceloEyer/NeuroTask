const fs = require('fs');

const file = 'src/hooks/useTasks.ts';
let code = fs.readFileSync(file, 'utf8');

const isValidTaskCode = `

function isValidTask(task: any): task is Task {
  if (!task || typeof task !== 'object') return false;

  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    ['Urgente/Agora', 'DJ & Carreira', 'Grana', 'Vida', 'Incubadora'].includes(task.domain) &&
    typeof task.impact === 'number' &&
    typeof task.urgency === 'number' &&
    typeof task.emotionalCost === 'number' &&
    ['Pequena', 'Média', 'Grande'].includes(task.size) &&
    Array.isArray(task.tags) &&
    ['inbox', 'agora', 'em_andamento', 'recomendadas', 'concluida', 'adiada'].includes(task.status) &&
    Array.isArray(task.checklist) &&
    typeof task.createdAt === 'string'
  );
}
`;

code = code.replace("export function useTasks() {", isValidTaskCode + "\nexport function useTasks() {");

fs.writeFileSync(file, code);
