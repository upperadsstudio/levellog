import { useState, useEffect } from 'react';
import { Proposal, Carga } from '../types';
import { useCargas } from './useCargas';

export const useProposals = (userId: string, userType: 'embarcador' | 'transportador' | 'transportadora') => {
  const { cargas, updateProposalStatus } = useCargas();
  const [loading, setLoading] = useState(false);

  const getProposalsForUser = () => {
    if (userType === 'embarcador') {
      // Embarcador vê propostas recebidas em suas cargas
      return cargas
        .filter(carga => carga.embarcadorId === userId)
        .flatMap(carga => 
          carga.proposals.map(proposal => ({ proposal, carga }))
        );
    } else {
      // Transportador vê suas propostas enviadas
      return cargas
        .flatMap(carga => 
          carga.proposals
            .filter(proposal => proposal.transportadorId === userId)
            .map(proposal => ({ proposal, carga }))
        );
    }
  };

  const acceptProposal = async (proposal: Proposal) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Encontrar a carga e atualizar status da proposta
      const carga = cargas.find(c => c.proposals.some(p => p.id === proposal.id));
      if (carga) {
        updateProposalStatus(carga.id, proposal.id, 'aceita');
        
        // Rejeitar outras propostas automaticamente
        carga.proposals
          .filter(p => p.id !== proposal.id && p.status === 'pendente')
          .forEach(p => updateProposalStatus(carga.id, p.id, 'recusada'));
      }
    } catch (error) {
      console.error('Erro ao aceitar proposta:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const rejectProposal = async (proposal: Proposal, reason?: string) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const carga = cargas.find(c => c.proposals.some(p => p.id === proposal.id));
      if (carga) {
        updateProposalStatus(carga.id, proposal.id, 'recusada');
      }
    } catch (error) {
      console.error('Erro ao recusar proposta:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCounterOffer = async (originalProposal: Proposal, counterOfferData: any) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const carga = cargas.find(c => c.proposals.some(p => p.id === originalProposal.id));
      if (carga) {
        // Marcar proposta original como contraproposta
        updateProposalStatus(carga.id, originalProposal.id, 'contraroposta');
        
        // Aqui normalmente criaria uma nova proposta ou atualizaria a existente
        // Por simplicidade, vamos apenas atualizar o status
      }
    } catch (error) {
      console.error('Erro ao criar contraproposta:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProposalStats = () => {
    const userProposals = getProposalsForUser();
    
    return {
      total: userProposals.length,
      pending: userProposals.filter(({ proposal }) => proposal.status === 'pendente').length,
      accepted: userProposals.filter(({ proposal }) => proposal.status === 'aceita').length,
      rejected: userProposals.filter(({ proposal }) => proposal.status === 'recusada').length,
      counterOffers: userProposals.filter(({ proposal }) => proposal.status === 'contraroposta').length,
    };
  };

  const getProposalsForCarga = (cargaId: string) => {
    const carga = cargas.find(c => c.id === cargaId);
    return carga ? carga.proposals : [];
  };

  return {
    proposals: getProposalsForUser(),
    loading,
    acceptProposal,
    rejectProposal,
    createCounterOffer,
    getProposalStats,
    getProposalsForCarga,
  };
};