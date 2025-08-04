import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileView } from '../components/profile/ProfileView';
import { ProfileEdit } from '../components/profile/ProfileEdit';
import { DocumentUpload } from '../components/profile/DocumentUpload';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  User, 
  FileText, 
  Shield,
  ArrowLeft
} from 'lucide-react';

interface ProfilePageProps {
  onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'documents'>('view');
  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'CPF',
      type: 'cpf' as const,
      status: 'approved' as const,
      uploadDate: new Date(),
      url: '/documents/cpf.pdf'
    },
    {
      id: '2',
      name: 'CNH',
      type: 'cnh' as const,
      status: 'pending' as const,
      uploadDate: new Date(),
      url: '/documents/cnh.pdf'
    }
  ]);

  if (!user) return null;

  const handleSaveProfile = (userData: any) => {
    // In a real app, this would update the user via API
    console.log('Saving profile:', userData);
    setActiveTab('view');
  };

  const handleUploadDocument = (file: File, type: string) => {
    // In a real app, this would upload to a server
    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      name: type.toUpperCase(),
      type: type as any,
      status: 'pending' as const,
      uploadDate: new Date(),
      url: URL.createObjectURL(file)
    };
    
    setDocuments(prev => [...prev, newDoc]);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const tabs = [
    { id: 'view', label: 'Perfil', icon: User },
    { id: 'edit', label: 'Editar', icon: FileText },
    { id: 'documents', label: 'Documentos', icon: Shield }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      )}

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {activeTab === 'view' && (
        <ProfileView 
          user={user} 
          isOwnProfile={true}
          onEdit={() => setActiveTab('edit')}
        />
      )}

      {activeTab === 'edit' && (
        <ProfileEdit
          user={user}
          onSave={handleSaveProfile}
          onCancel={() => setActiveTab('view')}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentUpload
          userType={user.type}
          documents={documents}
          onUpload={handleUploadDocument}
          onDelete={handleDeleteDocument}
        />
      )}
    </div>
  );
};