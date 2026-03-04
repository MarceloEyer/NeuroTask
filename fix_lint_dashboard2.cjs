const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = `import {
  LayoutDashboard,
  Clock,
  Play,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Calendar,
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { EmotionalTaskModal } from './EmotionalTaskModal';
import { BreakdownModal } from './BreakdownModal';
import { calculatePriority } from '../utils/priority';`;

const replace = `import {
  LayoutDashboard,
  Clock,
  Play,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Calendar,
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { EmotionalTaskModal } from './EmotionalTaskModal';
import { BreakdownModal } from './BreakdownModal';`;

content = content.replace(search, replace);

fs.writeFileSync(file, content);
