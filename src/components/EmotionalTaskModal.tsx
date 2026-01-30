import { useState, useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';
import { X, Heart, Send } from 'lucide-react';
import { suggestNextAction, getMessageTemplate } from '../utils/priority';

interface EmotionalTaskModalProps {
  taskId: string;
  onClose: () => void;
}

export function EmotionalTaskModal({ taskId, onClose }: EmotionalTaskModalProps) {
  const { tasks, addChecklistItem, moveToStatus } = useTasks();
  const task = tasks.find((t) => t.id === taskId);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'suggestion' | 'draft' | 'ready'>('suggestion');

  useEffect(() => {
    if (task?.emotionalType) {
      setMessage(getMessageTemplate(task.emotionalType));
    }
  }, [task]);

  if (!task) return null;

  const nextAction = suggestNextAction(task);

  const handleStartDraft = () => {
    setStep('draft');
  };

  const handleSaveDraft = () => {
    addChecklistItem(task.id, 'Revisar e enviar mensagem rascunhada');
    setStep('ready');
  };

  const handleMarkReady = () => {
    if (step === 'ready') {
      moveToStatus(task.id, 'agora');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-slate-800">Modo Suave</h2>
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
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">
                {task.emotionalType}
              </span>
              <span className="text-slate-600">Custo emocional: {task.emotionalCost}/5</span>
            </div>
          </div>

          {step === 'suggestion' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Próxima ação de 2 minutos</h4>
              <p className="text-blue-800">{nextAction}</p>
              <button
                onClick={handleStartDraft}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Começar rascunho
              </button>
            </div>
          )}

          {step === 'draft' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rascunho de mensagem (editável)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
                  placeholder="Digite sua mensagem aqui..."
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Dicas</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>Seja direto e educado</li>
                  <li>Foque no problema, não na pessoa</li>
                  <li>Sugira uma solução ou próximo passo</li>
                  <li>Mantenha o tom profissional e amigável</li>
                </ul>
              </div>

              <button
                onClick={handleSaveDraft}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Rascunho pronto
              </button>
            </div>
          )}

          {step === 'ready' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Rascunho salvo</h4>
                <p className="text-green-800 mb-4">
                  Seu rascunho foi salvo. Agora você pode revisar e enviar quando estiver pronto.
                </p>
                <div className="bg-white rounded p-3 text-sm text-slate-700 border border-green-300">
                  {message}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  A tarefa foi atualizada com um item de checklist. Você pode:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>Copiar o texto e enviá-lo agora</li>
                  <li>Fazer ajustes e enviar mais tarde</li>
                  <li>Adicionar a tarefa em AGORA e executar</li>
                </ul>
              </div>

              <button
                onClick={handleMarkReady}
                className="w-full px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors"
              >
                Mover para AGORA
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
