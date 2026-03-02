import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { X, ListChecks, Plus, Trash2 } from 'lucide-react';

interface BreakdownModalProps {
  taskId: string;
  onClose: () => void;
}

export function BreakdownModal({ taskId, onClose }: BreakdownModalProps) {
  const { tasks, addChecklistItem, toggleChecklistItem } = useTasks();
  const task = tasks.find((t) => t.id === taskId);
  const [newItem, setNewItem] = useState('');

  if (!task) return null;

  const handleAddItem = () => {
    if (newItem.trim()) {
      addChecklistItem(task.id, newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  const suggestedSteps = task.size === 'Grande' && task.checklist.length === 0 ? [
    'Definir objetivo final claro',
    'Listar recursos necessários',
    'Identificar primeira ação concreta',
    'Criar checklist de micro-passos',
    'Revisar e simplificar',
  ] : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-800">Quebrar em Microtarefas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">{task.title}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">
                {task.domain}
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">
                {task.size}
              </span>
            </div>
          </div>

          {suggestedSteps.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Sugestões de passos</h4>
              <div className="space-y-2">
                {suggestedSteps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addChecklistItem(task.id, step);
                    }}
                    className="w-full text-left px-3 py-2 bg-white border border-blue-200 rounded-md hover:bg-blue-100 transition-colors text-sm text-blue-800"
                  >
                    {index + 1}. {step}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Adicionar microtarefa
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ex: Ligar para contratante"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>

          {task.checklist.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-800 mb-3">
                Checklist ({task.checklist.filter(i => i.completed).length}/{task.checklist.length})
              </h4>
              <div className="space-y-2">
                {task.checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-md"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(task.id, item.id)}
                      className="rounded"
                    />
                    <span
                      className={`flex-1 ${
                        item.completed ? 'line-through text-slate-500' : 'text-slate-700'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.checklist.length === 0 && suggestedSteps.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma microtarefa ainda. Adicione uma acima.</p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-medium text-slate-700 mb-2">Dica</h4>
            <p className="text-sm text-slate-600">
              Quebre a tarefa em passos de 5-15 minutos cada. Quanto menor, melhor para vencer a
              procrastinação. Foque na próxima ação concreta.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
