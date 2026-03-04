const fs = require('fs');
const file = 'src/hooks/useTasks.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('function isValidTask(task: any): task is Task {', 'function isValidTask(task: unknown): task is Task {');
code = code.replace(/typeof task !== 'object'/g, "typeof task !== 'object' || task === null");

const replacements = [
  "task.id", "task.title", "task.domain", "task.impact", "task.urgency", "task.emotionalCost",
  "task.size", "task.tags", "task.status", "task.checklist", "task.createdAt"
];

let replacedCode = code;
replacements.forEach(key => {
    replacedCode = replacedCode.replace(new RegExp("task\\\\." + key.split('.')[1], "g"), `(task as Record<string, unknown>).${key.split('.')[1]}`);
});

fs.writeFileSync(file, replacedCode);
