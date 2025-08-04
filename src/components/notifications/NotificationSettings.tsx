import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { 
  Bell,
  Mail,
  MessageSquare,
  Clock,
  Settings,
  Save,
  ArrowLeft
} from 'lucide-react';

interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  types: {
    proposals: boolean;
    messages: boolean;
    deliveries: boolean;
    payments: boolean;
    ratings: boolean;
    alerts: boolean;
    system: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
  onBack?: () => void;
}

export const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({
  settings,
  onSave,
  onBack
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
  };

  const updateSetting = (path: string, value: any) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const notificationTypes = [
    { key: 'proposals', label: 'Propostas', description: 'Novas propostas recebidas' },
    { key: 'messages', label: 'Mensagens', description: 'Mensagens de chat' },
    { key: 'deliveries', label: 'Entregas', description: 'Status de entregas' },
    { key: 'payments', label: 'Pagamentos', description: 'Lembretes de pagamento' },
    { key: 'ratings', label: 'Avaliações', description: 'Novas avaliações recebidas' },
    { key: 'alerts', label: 'Alertas', description: 'Alertas importantes' },
    { key: 'system', label: 'Sistema', description: 'Atualizações do sistema' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações de Notificações</h1>
            <p className="text-gray-600">Personalize como e quando receber notificações</p>
          </div>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      {/* Métodos de Notificação */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Métodos de Notificação</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium">Notificações Push</h4>
                <p className="text-sm text-gray-600">Receba notificações no navegador</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enablePush}
                onChange={(e) => updateSetting('enablePush', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium">E-mail</h4>
                <p className="text-sm text-gray-600">Receba notificações por e-mail</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enableEmail}
                onChange={(e) => updateSetting('enableEmail', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium">SMS</h4>
                <p className="text-sm text-gray-600">Receba notificações por SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.enableSMS}
                onChange={(e) => updateSetting('enableSMS', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Notificação */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Tipos de Notificação</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{type.label}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localSettings.types[type.key as keyof typeof localSettings.types]}
                    onChange={(e) => updateSetting(`types.${type.key}`, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Horário Silencioso */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Horário Silencioso</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium">Ativar Horário Silencioso</h4>
                <p className="text-sm text-gray-600">Não receber notificações em horários específicos</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.quietHours.enabled}
                onChange={(e) => updateSetting('quietHours.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {localSettings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Início
                </label>
                <Input
                  type="time"
                  value={localSettings.quietHours.start}
                  onChange={(e) => updateSetting('quietHours.start', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fim
                </label>
                <Input
                  type="time"
                  value={localSettings.quietHours.end}
                  onChange={(e) => updateSetting('quietHours.end', e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Teste de Notificação */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Teste de Notificação</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Enviar Notificação de Teste</h4>
              <p className="text-sm text-gray-600">Teste suas configurações com uma notificação de exemplo</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('Teste de Notificação', {
                    body: 'Suas configurações estão funcionando corretamente!',
                    icon: '/favicon.ico'
                  });
                } else {
                  alert('Notificações não estão habilitadas no seu navegador');
                }
              }}
            >
              <Bell className="h-4 w-4 mr-2" />
              Enviar Teste
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};