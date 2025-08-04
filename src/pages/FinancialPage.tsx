import React, { useState } from 'react';
import { FinancialDashboard } from '../components/financial/FinancialDashboard';
import { ReportsPage } from '../components/financial/ReportsPage';
import { ContractsPage } from '../components/financial/ContractsPage';

type FinancialView = 'dashboard' | 'reports' | 'contracts';

export const FinancialPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<FinancialView>('dashboard');

  const handleViewChange = (view: FinancialView) => {
    setCurrentView(view);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  switch (currentView) {
    case 'reports':
      return <ReportsPage onBack={handleBackToDashboard} />;
    case 'contracts':
      return <ContractsPage onBack={handleBackToDashboard} />;
    default:
      return (
        <FinancialDashboard
          onViewReports={() => handleViewChange('reports')}
          onViewContracts={() => handleViewChange('contracts')}
        />
      );
  }
};