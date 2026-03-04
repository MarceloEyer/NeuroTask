const fs = require('fs');
const file = 'src/components/BreakdownModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = `import { X, ListChecks, Plus, Trash2 } from 'lucide-react';`;
const replace = `import { X, ListChecks, Plus } from 'lucide-react';`;

content = content.replace(search, replace);

fs.writeFileSync(file, content);
