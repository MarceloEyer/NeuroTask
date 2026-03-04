const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const displayedTasks = paretoMode[\s\S]*?: allActiveTasks;/m, '');

fs.writeFileSync(file, code);
