const fs = require('fs');
const file = 'src/components/TaskCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = `import {
  Play,
  Check,
  Clock,
  ListChecks,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';`;

const replace = `import {
  Play,
  Check,
  Clock,
  ListChecks,
  AlertCircle,
} from 'lucide-react';`;

content = content.replace(search, replace);

fs.writeFileSync(file, content);
