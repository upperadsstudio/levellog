import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Upload,
  FileText,
  Check,
  X,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'cpf' | 'cnpj' | 'cnh' | 'crlv' | 'antt' | 'outros';
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: Date;
  url?: string;
  rejectionReason?: string;
}

interface DocumentUploadProps {
  userType: 'embarcador' | 'transportador' | 'transportadora';
  documents: Document[];
  onUpload: (file: File, type: string) => void;
  onDelete: (documentId: string) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  userType,
  documents,
  onUpload,
  onDelete
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState('');

  const getRequiredDocuments = () => {
    const common = [
      { type: 'cpf', name: 'CPF', required: true },
      { type: 'cnpj', name: 'CNPJ', required: userType !== 'transportador' }
    ];

    if (userType === 'transportador') {
      return [
        ...common,
        { type: 'cnh', name: 'CNH', required: true },
        { type: 'crlv', name: 'CRLV', required: true },
        { type: 'antt', name: 'ANTT', required: false }
      ];
    }

    return common;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedType) {
      onUpload(file, selectedType);
      setSelectedType('');
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && selectedType) {
      onUpload(file, selectedType);
      setSelectedType('');
    }
  };

  const getDocumentStatus = (type: string) => {
    const doc = documents.find(d => d.type === type);
    return doc?.status || 'missing';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" size="sm">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="error" size="sm">Rejeitado</Badge>;
      default:
        return <Badge variant="default" size="sm">Não enviado</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Upload className="h-4 w-4 text-gray-400" />;
    }
  };

  const requiredDocs = getRequiredDocuments();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Documentos</h3>
          <p className="text-sm text-gray-600">
            Envie seus documentos para verificação. Documentos aprovados aumentam sua credibilidade.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requiredDocs.map((docType) => {
              const status = getDocumentStatus(docType.type);
              const document = documents.find(d => d.type === docType.type);
              
              return (
                <div key={docType.type} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(status)}
                      <div>
                        <h4 className="font-medium">{docType.name}</h4>
                        {docType.required && (
                          <span className="text-xs text-red-600">Obrigatório</span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  {document && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Enviado em {document.uploadDate.toLocaleDateString('pt-BR')}</span>
                        <div className="flex space-x-2">
                          {document.url && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                Ver
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-3 w-3 mr-1" />
                                Baixar
                              </Button>
                            </>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onDelete(document.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Remover
                          </Button>
                        </div>
                      </div>
                      
                      {document.status === 'rejected' && document.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                          <strong>Motivo da rejeição:</strong> {document.rejectionReason}
                        </div>
                      )}
                    </div>
                  )}

                  {status !== 'approved' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedType === docType.type ? docType.type : ''}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          <option value="">Selecionar tipo de documento</option>
                          <option value={docType.type}>{docType.name}</option>
                        </select>
                      </div>

                      {selectedType === docType.type && (
                        <div
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                          }`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                        >
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Arraste o arquivo aqui ou clique para selecionar
                          </p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                            id={`file-${docType.type}`}
                          />
                          <label htmlFor={`file-${docType.type}`}>
                            <Button variant="outline" size="sm" type="button">
                              Selecionar Arquivo
                            </Button>
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            PDF, JPG, PNG até 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Diretrizes para Upload</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Documentos devem estar legíveis e sem cortes</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Formatos aceitos: PDF, JPG, PNG</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Tamanho máximo: 5MB por arquivo</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-4 w-4 text-green-600 mt-0.5" />
              <span>Documentos dentro da validade</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <span>A verificação pode levar até 2 dias úteis</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};