import { Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import {
  Play,
  Check,
  Clock,
  ListChecks,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import {
  getTaskIcon,
  getDaysUntilDeadline,
  shouldBreakDown,
  calculatePriority,
} from '../utils/priority';

interface TaskCardProps {
  task: Task;
  onEmotionalTask: (taskId: string) => void;
  onBreakdown: (taskId: string) => void;
  canAddToAgora: boolean;
  canAddToEmAndamento: boolean;
  showPriority?: boolean;
}

export function TaskCard({
  task,
  onEmotionalTask,
  onBreakdown,
  canAddToAgora,
  canAddToEmAndamento,
  showPriority,
}: TaskCardProps) {
  const { moveToStatus, toggleChecklistItem } = useTasks();

  const icons = getTaskIcon(task);
  const daysUntilDeadline = getDaysUntilDeadline(task.deadline);
  const needsBreakdown = shouldBreakDown(task);
  const priority = showPriority ? calculatePriority(task) : null;

  const completedItems = task.checklist.filter((item) => item.completed).length;
  const totalItems = task.checklist.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleStart = () => {
    if (task.status === 'agora') {
      moveToStatus(task.id, 'em_andamento');
    } else if (canAddToAgora) {
      moveToStatus(task.id, 'agora');
    } else if (canAddToEmAndamento) {
      moveToStatus(task.id, 'em_andamento');
    }
  };

  const handleComplete = () => {
    if (totalItems > 0 && completedItems < totalItems) {
      return;
    }
    moveToStatus(task.id, 'concluida');
  };

  const canComplete = totalItems === 0 || completedItems === totalItems;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-slate-800 flex-1">{task.title}</h3>
        {icons && <span className="text-lg">{icons}</span>}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
          {task.domain}
        </span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
          {task.size}
        </span>
        {task.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
            {tag}
          </span>
        ))}
        {priority !== null && (
          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded font-medium">
            P: {priority}
          </span>
        )}
      </div>

      {daysUntilDeadline !== null && (
        <div className="flex items-center gap-1 text-sm mb-2">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className={daysUntilDeadline <= 3 ? 'text-orange-600 font-medium' : 'text-slate-600'}>
            {daysUntilDeadline === 0
              ? 'Hoje'
              : daysUntilDeadline === 1
              ? 'Amanhã'
              : daysUntilDeadline < 0
              ? `Atrasado ${Math.abs(daysUntilDeadline)}d`
              : `${daysUntilDeadline} dias`}
          </span>
        </div>
      )}

      {task.emotionalType && (
        <div className="flex items-center gap-1 text-sm mb-2 text-orange-700">
          <AlertCircle className="w-4 h-4" />
          <span>EMOCIONAL: {task.emotionalType}</span>
        </div>
      )}

      {needsBreakdown && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3 text-sm text-yellow-800">
          Tarefa grande precisa ser quebrada em microtarefas
        </div>
      )}

      {totalItems > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
            <span>
              {completedItems}/{totalItems} concluídos
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 space-y-1">
            {task.checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleChecklistItem(task.id, item.id)}
                  className="rounded"
                />
                <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-700'}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {task.status !== 'em_andamento' && task.status !== 'concluida' && (
          <button
            onClick={handleStart}
            disabled={needsBreakdown || (!canAddToAgora && !canAddToEmAndamento)}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Play className="w-4 h-4" />
            {task.status === 'agora' ? 'Iniciar' : 'Mover para Agora'}
          </button>
        )}

        {task.status === 'em_andamento' && (
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            Concluir
          </button>
        )}

        <div className="flex gap-2">
          {task.emotionalType && (
            <button
              onClick={() => onEmotionalTask(task.id)}
              className="flex-1 px-3 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50 transition-colors text-sm font-medium"
            >
              Modo Suave
            </button>
          )}

          <button
            onClick={() => onBreakdown(task.id)}
            className="flex-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <ListChecks className="w-4 h-4" />
            Quebrar
          </button>
        </div>
      </div>
    </div>
  );
}
