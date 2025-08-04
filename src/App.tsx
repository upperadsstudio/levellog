import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard';
import { TransportadorDashboard } from './pages/TransportadorDashboard';
import { AuthPage } from './pages/AuthPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Renderizar dashboard específico baseado no tipo de usuário
  if (user.type === 'transportador' || user.type === 'transportadora') {
    return <TransportadorDashboard />;
  }
  
  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;