import { useState } from 'react';
import { Task, Domain } from '../types';
import { useTasks } from '../hooks/useTasks';
import {
  LayoutDashboard,
  Play,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { EmotionalTaskModal } from './EmotionalTaskModal';
import { BreakdownModal } from './BreakdownModal';

export function Dashboard() {
  const { tasks, getTasksByStatus, moveToStatus, getRecommendedTasks } = useTasks();
  const [paretoMode, setParetoMode] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<Domain[]>([]);
  const [emotionalTaskId, setEmotionalTaskId] = useState<string | null>(null);
  const [breakdownTaskId, setBreakdownTaskId] = useState<string | null>(null);

  const agoraTasks = getTasksByStatus('agora');
  const emAndamentoTasks = getTasksByStatus('em_andamento');
  const completedTasks = getTasksByStatus('concluida');

  const allActiveTasks = tasks.filter(
    (t) => t.status !== 'inbox' && t.status !== 'concluida' && t.status !== 'adiada'
  );

  const domainTasks: Record<Domain, Task[]> = {
    'Trabalho': [],
    'Finanças': [],
    'Saúde': [],
    'Casa': [],
    'Relacionamentos': [],
    'Pessoal': [],
    'Aprendizado': [],
    'Projetos': [],
    'Admin': [],
  };

  allActiveTasks.forEach((task) => {
    if (task.status !== 'agora' && task.status !== 'em_andamento') {
      domainTasks[task.domain].push(task);
    }
  });

  const toggleDomain = (domain: Domain) => {
    setExpandedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleChooseForMe = () => {
    const recommended = getRecommendedTasks();

    let agoraCount = agoraTasks.length;
    let emAndamentoCount = emAndamentoTasks.length;

    recommended.forEach((task) => {
      if (agoraCount < 2 && task.status !== 'agora' && task.status !== 'em_andamento') {
        moveToStatus(task.id, 'agora');
        agoraCount++;
      } else if (
        emAndamentoCount < 1 &&
        agoraCount >= 2 &&
        task.status !== 'agora' &&
        task.status !== 'em_andamento'
      ) {
        moveToStatus(task.id, 'em_andamento');
        emAndamentoCount++;
      }
    });
  };

  const canAddToAgora = agoraTasks.length < 2;
  const canAddToEmAndamento = emAndamentoTasks.length < 1;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-slate-700" />
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Dashboard de Execução</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setParetoMode(!paretoMode)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              paretoMode
                ? 'bg-slate-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pareto 80/20
          </button>
          <button
            onClick={handleChooseForMe}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Escolher por mim
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              AGORA (máx 2)
            </h2>
            <span className="text-sm text-slate-600">
              {agoraTasks.length}/2
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {agoraTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEmotionalTask={setEmotionalTaskId}
                onBreakdown={setBreakdownTaskId}
                canAddToAgora={false}
                canAddToEmAndamento={canAddToEmAndamento}
              />
            ))}
            {agoraTasks.length === 0 && (
              <div className="col-span-2 border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-500">
                Nenhuma tarefa em AGORA. Use "Escolher por mim" ou arraste tarefas aqui.
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Play className="w-5 h-5 text-blue-600" />
              EM ANDAMENTO (máx 1)
            </h2>
            <span className="text-sm text-slate-600">
              {emAndamentoTasks.length}/1
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {emAndamentoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEmotionalTask={setEmotionalTaskId}
                onBreakdown={setBreakdownTaskId}
                canAddToAgora={canAddToAgora}
                canAddToEmAndamento={false}
              />
            ))}
            {emAndamentoTasks.length === 0 && (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-500">
                Nenhuma tarefa em andamento. Inicie uma das tarefas de AGORA.
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-green-600" />
            RECOMENDADAS HOJE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecommendedTasks().slice(0, 5).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEmotionalTask={setEmotionalTaskId}
                onBreakdown={setBreakdownTaskId}
                canAddToAgora={canAddToAgora}
                canAddToEmAndamento={canAddToEmAndamento}
                showPriority
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-3">DOMÍNIOS</h2>
          <div className="space-y-3">
            {(Object.keys(domainTasks) as Domain[]).map((domain) => {
              const tasks = domainTasks[domain];
              if (tasks.length === 0) return null;

              const isExpanded = expandedDomains.includes(domain);

              return (
                <div key={domain} className="bg-white rounded-lg border border-slate-200">
                  <button
                    onClick={() => toggleDomain(domain)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-800">
                      {domain} ({tasks.length})
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEmotionalTask={setEmotionalTaskId}
                          onBreakdown={setBreakdownTaskId}
                          canAddToAgora={canAddToAgora}
                          canAddToEmAndamento={canAddToEmAndamento}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {completedTasks.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              CONCLUÍDAS ({completedTasks.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.slice(0, 6).map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-50 rounded-lg border border-slate-200 p-4 opacity-75"
                >
                  <h3 className="font-medium text-slate-700 line-through mb-1">{task.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 bg-white rounded">{task.domain}</span>
                    {task.completedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {emotionalTaskId && (
        <EmotionalTaskModal
          taskId={emotionalTaskId}
          onClose={() => setEmotionalTaskId(null)}
        />
      )}

      {breakdownTaskId && (
        <BreakdownModal
          taskId={breakdownTaskId}
          onClose={() => setBreakdownTaskId(null)}
        />
      )}
    </div>
  );
}
