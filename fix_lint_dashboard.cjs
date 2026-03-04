const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const searchRecomendadas = `  const recomendadasTasks = getTasksByStatus('recomendadas');\n`;
content = content.replace(searchRecomendadas, '');

const searchDisplayed = `  const displayedTasks = paretoMode
    ? allActiveTasks
        .map((task) => ({ task, priority: calculatePriority(task) }))
        .sort((a, b) => b.priority - a.priority)
        .slice(0, Math.ceil(allActiveTasks.length * 0.2))
        .map((item) => item.task)
    : allActiveTasks;\n\n`;
content = content.replace(searchDisplayed, '');

fs.writeFileSync(file, content);
