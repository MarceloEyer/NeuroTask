export type Domain =
  | 'Trabalho'
  | 'Finanças'
  | 'Saúde'
  | 'Casa'
  | 'Relacionamentos'
  | 'Pessoal'
  | 'Aprendizado'
  | 'Projetos'
  | 'Admin';

export type LegacyDomain = 'Urgente/Agora' | 'DJ & Carreira' | 'Grana' | 'Vida' | 'Incubadora';

export type Size = 'Pequena' | 'Média' | 'Grande';

export type Status = 'inbox' | 'agora' | 'em_andamento' | 'recomendadas' | 'concluida' | 'adiada';

export type Tag = 'RÁPIDO 5min' | 'FOCO 1h' | 'EXTERNO';

export type EmotionalType = 'Cobrança' | 'Conflito' | 'Conversa difícil' | 'Outro';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  domain: Domain;
  impact: number;
  urgency: number;
  emotionalCost: number;
  emotionalType?: EmotionalType;
  size: Size;
  deadline?: string;
  tags: Tag[];
  status: Status;
  checklist: ChecklistItem[];
  createdAt: string;
  completedAt?: string;
  deferReason?: string;
}

export interface TaskFormData {
  title: string;
  domain: Domain;
  impact: number;
  urgency: number;
  emotionalCost: number;
  emotionalType?: EmotionalType;
  size: Size;
  deadline?: string;
  tags: Tag[];
}

export interface StorageData {
  schemaVersion: number;
  exportedAt?: string;
  tasks: Task[];
}

export const CURRENT_SCHEMA_VERSION = 2;
