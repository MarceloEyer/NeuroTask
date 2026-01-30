import { useState } from 'react';
import { Inbox } from './components/Inbox';
import { Dashboard } from './components/Dashboard';
import { LoginModal } from './components/LoginModal';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './contexts/AuthContext';
import { Inbox as InboxIcon, LayoutDashboard, Download, Upload, User, LogOut } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'inbox' | 'dashboard'>('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { exportData, importData } = useTasks();
  const { user, signOut, isConfigured } = useAuth();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          importData(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">Zen Productivity</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'dashboard'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('inbox')}
                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  currentView === 'inbox'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <InboxIcon className="w-4 h-4" />
                Inbox
              </button>

              <div className="ml-4 flex items-center gap-2 border-l border-slate-200 pl-4">
                <button
                  onClick={exportData}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Exportar dados"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleImport}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                  title="Importar dados"
                >
                  <Upload className="w-4 h-4" />
                </button>

                {isConfigured && (
                  <>
                    {user ? (
                      <button
                        onClick={() => signOut()}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Sair"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        title="Login"
                      >
                        <User className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pb-8">
        {currentView === 'inbox' ? <Inbox /> : <Dashboard />}
      </main>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}

export default App;
