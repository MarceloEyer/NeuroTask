const fs = require('fs');

let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
content = content.replace(/const recomendadasTasks = getTasksByStatus\('recomendadas'\);\n/, '');
content = content.replace(/const displayedTasks = paretoMode\n[\s\S]*?\n    : allActiveTasks;/, '');
fs.writeFileSync('src/components/Dashboard.tsx', content);
