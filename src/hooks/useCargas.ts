import { useState, useEffect } from 'react';
import { Carga, Proposal } from '../types';
import { mockCargas } from '../data/mockData';

export const useCargas = () => {
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setCargas(mockCargas);
      setLoading(false);
    }, 1000);
  }, []);

  const createCarga = async (cargaData: Omit<Carga, 'id' | 'createdAt' | 'proposals'>) => {
    const newCarga: Carga = {
      ...cargaData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      proposals: [],
    };

    setCargas(prev => [newCarga, ...prev]);
    return newCarga;
  };

  const createProposal = async (cargaId: string, proposalData: Omit<Proposal, 'id' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };

    setCargas(prev => prev.map(carga => 
      carga.id === cargaId 
        ? { ...carga, proposals: [...carga.proposals, newProposal] }
        : carga
    ));

    return newProposal;
  };

  const updateCargaStatus = (cargaId: string, status: Carga['status']) => {
    setCargas(prev => prev.map(carga => 
      carga.id === cargaId ? { ...carga, status } : carga
    ));
  };

  const updateProposalStatus = (cargaId: string, proposalId: string, status: Proposal['status']) => {
    setCargas(prev => prev.map(carga => 
      carga.id === cargaId 
        ? {
            ...carga,
            proposals: carga.proposals.map(proposal =>
              proposal.id === proposalId ? { ...proposal, status } : proposal
            )
          }
        : carga
    ));
  };

  return {
    cargas,
    loading,
    createCarga,
    createProposal,
    updateCargaStatus,
    updateProposalStatus,
  };
};