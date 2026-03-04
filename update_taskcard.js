const fs = require('fs');
const file = 'src/components/TaskCard.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = `  const canComplete = totalItems === 0 || completedItems === totalItems;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all">`;

const replace = `  const canComplete = totalItems === 0 || completedItems === totalItems;

  const renderPrimaryAction = () => {
    if (task.status === 'concluida') return null;

    if (task.status === 'em_andamento') {
      return (
        <button
          onClick={handleComplete}
          disabled={!canComplete}
          className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <Check className="w-4 h-4" />
          Concluir
        </button>
      );
    }

    return (
      <button
        onClick={handleStart}
        disabled={needsBreakdown || (!canAddToAgora && !canAddToEmAndamento)}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
      >
        <Play className="w-4 h-4" />
        {task.status === 'agora' ? 'Iniciar' : 'Mover para Agora'}
      </button>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-all">`;

content = content.replace(search, replace);

const search2 = `      <div className="flex flex-col gap-2">
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

        <div className="flex gap-2">`;

const replace2 = `      <div className="flex flex-col gap-2">
        {renderPrimaryAction()}

        <div className="flex gap-2">`;

content = content.replace(search2, replace2);

fs.writeFileSync(file, content);
