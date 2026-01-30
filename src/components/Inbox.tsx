import { useState } from 'react';
import { Task, Domain, Size, Tag, EmotionalType } from '../types';
import { useTasks } from '../hooks/useTasks';
import { Inbox as InboxIcon, Plus, ArrowRight, Edit2, Trash2 } from 'lucide-react';

export function Inbox() {
  const { getTasksByStatus, addTask, updateTask, moveToStatus, deleteTask } = useTasks();
  const inboxTasks = getTasksByStatus('inbox');

  const [isQuickAdd, setIsQuickAdd] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    domain: 'Pessoal' as Domain,
    impact: 3,
    urgency: 3,
    emotionalCost: 1,
    emotionalType: undefined as EmotionalType | undefined,
    size: 'Média' as Size,
    deadline: '',
    tags: [] as Tag[],
  });

  const resetForm = () => {
    setFormData({
      title: '',
      domain: 'Pessoal',
      impact: 3,
      urgency: 3,
      emotionalCost: 1,
      emotionalType: undefined,
      size: 'Média',
      deadline: '',
      tags: [],
    });
    setIsQuickAdd(false);
    setEditingTask(null);
  };

  const handleQuickAdd = () => {
    if (!formData.title.trim()) return;
    addTask(formData);
    resetForm();
  };

  const handleFullAdd = () => {
    if (!formData.title.trim()) return;
    addTask(formData);
    resetForm();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      domain: task.domain,
      impact: task.impact,
      urgency: task.urgency,
      emotionalCost: task.emotionalCost,
      emotionalType: task.emotionalType,
      size: task.size,
      deadline: task.deadline || '',
      tags: task.tags,
    });
  };

  const handleUpdate = () => {
    if (!editingTask) return;
    updateTask(editingTask, formData);
    resetForm();
  };

  const canMoveToDashboard = (task: Task) => {
    return task.title && task.domain && task.size;
  };

  const toggleTag = (tag: Tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <InboxIcon className="w-8 h-8 text-slate-700" />
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">Captura / Inbox</h1>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 md:p-6 mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="O que precisa ser feito?"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Domínio *
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value as Domain })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="Trabalho">Trabalho</option>
                <option value="Finanças">Finanças</option>
                <option value="Saúde">Saúde</option>
                <option value="Casa">Casa</option>
                <option value="Relacionamentos">Relacionamentos</option>
                <option value="Pessoal">Pessoal</option>
                <option value="Aprendizado">Aprendizado</option>
                <option value="Projetos">Projetos</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tamanho *
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value as Size })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="Pequena">Pequena</option>
                <option value="Média">Média</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
          </div>

          {!isQuickAdd && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Impacto (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Urgência (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Custo Emocional (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.emotionalCost}
                    onChange={(e) => setFormData({ ...formData, emotionalCost: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {formData.emotionalCost >= 3 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tipo Emocional
                  </label>
                  <select
                    value={formData.emotionalType || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emotionalType: e.target.value ? (e.target.value as EmotionalType) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="">Nenhum</option>
                    <option value="Cobrança">Cobrança</option>
                    <option value="Conflito">Conflito</option>
                    <option value="Conversa difícil">Conversa difícil</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prazo (opcional)
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tags Rápidas
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['RÁPIDO 5min', 'FOCO 1h', 'EXTERNO'] as Tag[]).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-slate-700 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {editingTask ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors"
                >
                  Atualizar
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                {isQuickAdd ? (
                  <>
                    <button
                      onClick={handleQuickAdd}
                      className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Rápido
                    </button>
                    <button
                      onClick={() => setIsQuickAdd(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                      Mais opções
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFullAdd}
                      className="flex-1 bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Completo
                    </button>
                    <button
                      onClick={() => {
                        setIsQuickAdd(true);
                      }}
                      className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                    >
                      Rápido
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          Tarefas no Inbox ({inboxTasks.length})
        </h2>

        {inboxTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <InboxIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma tarefa no inbox. Adicione uma nova acima.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {inboxTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-800 mb-1">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 rounded">{task.domain}</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded">{task.size}</span>
                      {task.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {task.emotionalType && (
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs">
                          🧠 {task.emotionalType}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task)}
                      className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {canMoveToDashboard(task) && (
                      <button
                        onClick={() => moveToStatus(task.id, 'recomendadas')}
                        className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                        title="Mover para Dashboard"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
