const fs = require('fs');

function replace(file, regex, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(regex, replaceStr);
  fs.writeFileSync(file, content);
}

replace('src/components/Dashboard.tsx', /const recomendadasTasks = getTasksByStatus\('recomendadas'\);/, '');
replace('src/components/Dashboard.tsx', /const displayedTasks = isParetoMode\s*\n\s*\?\s*allActiveTasks\s*\n\s*\.map\(\(task\) => \(\{ task, priority: calculatePriority\(task\) \}\)\)\s*\n\s*\.sort\(\(a, b\) => b\.priority - a\.priority\)\s*\n\s*\.slice\(0, Math\.ceil\(allActiveTasks\.length \* 0\.2\)\)\s*\n\s*:\s*recomendadasTasks;/, 'const displayedTasks = isParetoMode\n    ? allActiveTasks\n        .map((task) => ({ task, priority: calculatePriority(task) }))\n        .sort((a, b) => b.priority - a.priority)\n        .slice(0, Math.ceil(allActiveTasks.length * 0.2))\n    : [];');
