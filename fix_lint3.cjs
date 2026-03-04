const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

content = content.replace(/const recomendadasTasks = getTasksByStatus\('recomendadas'\);/, '');
content = content.replace(/const displayedTasks = paretoMode\s*\n\s*\? allActiveTasks\s*\n\s*\.map\(\(task\) => \(\{ task, priority: calculatePriority\(task\) \}\)\)\s*\n\s*\.sort\(\(a, b\) => b\.priority - a\.priority\)\s*\n\s*\.slice\(0, Math\.ceil\(allActiveTasks\.length \* 0\.2\)\)\s*\n\s*: recomendadasTasks;/, '');

fs.writeFileSync('src/components/Dashboard.tsx', content);
