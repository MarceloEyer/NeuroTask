const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = `import { BreakdownModal } from './BreakdownModal';
import { calculatePriority } from '../utils/priority';`;

const replace = `import { BreakdownModal } from './BreakdownModal';`;

content = content.replace(search, replace);

fs.writeFileSync(file, content);
