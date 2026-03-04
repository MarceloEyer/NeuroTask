const fs = require('fs');

function replace(file, search, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(search, replaceStr);
  fs.writeFileSync(file, content);
}

replace('src/components/BreakdownModal.tsx', /Trash2,?|,\s*Trash2/g, '');
replace('src/components/Dashboard.tsx', /const recomendadasTasks = getTasksByStatus\('recomendadas'\);/, '');
replace('src/components/Dashboard.tsx', /const displayedTasks = isParetoMode\n[\s\S]*?\.slice\(0, Math\.ceil\(allActiveTasks\.length \* 0\.2\)\)\n\s*:\s*recomendadasTasks;/, 'const displayedTasks = isParetoMode\n    ? allActiveTasks\n        .map((task) => ({ task, priority: calculatePriority(task) }))\n        .sort((a, b) => b.priority - a.priority)\n        .slice(0, Math.ceil(allActiveTasks.length * 0.2))\n    : [];');
replace('src/components/TaskCard.tsx', /ChevronRight,?|,\s*ChevronRight/g, '');
