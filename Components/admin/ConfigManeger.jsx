import React, { useState, useEffect } from "react";
import { PlatformConfig } from "@/entities/PlatformConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Settings2 } from "lucide-react";

export default function ConfigManager({ onStatsUpdate }) {
  const [config, setConfig] = useState({
    platform_name: "RotaMed",
    platform_tagline: "Sua melhor rota para a medicina!",
    dashboard_title: "Descubra novos conhecimentos",
    dashboard_subtitle: "Explore nossa coleção de cursos - todos liberados!",
    welcome_message: "Bem-vindo à nossa plataforma de ensino!"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configId, setConfigId] = useState(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configs = await PlatformConfig.list();
      if (configs.length > 0) {
        setConfig(configs[0]);
        setConfigId(configs[0].id);
      }
    } catch (error) {
      console.error("Error loading platform config:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (configId) {
        await PlatformConfig.update(configId, config);
      } else {
        const newConfig = await PlatformConfig.create(config);
        setConfigId(newConfig.id);
      }
      
      // Atualizar o layout para refletir as mudanças
      window.location.reload();
    } catch (error) {
      console.error("Error saving config:", error);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Configurações da Plataforma</h2>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5" />
              Informações da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform_name" className="text-zinc-400">Nome da Plataforma</Label>
              <Input
                id="platform_name"
                value={config.platform_name}
                onChange={(e) => setConfig({...config, platform_name: e.target.value})}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="platform_tagline" className="text-zinc-400">Slogan da Plataforma</Label>
              <Input
                id="platform_tagline"
                value={config.platform_tagline}
                onChange={(e) => setConfig({...config, platform_tagline: e.target.value})}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações do Dashboard */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Textos do Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dashboard_title" className="text-zinc-400">Título Principal</Label>
              <Input
                id="dashboard_title"
                value={config.dashboard_title}
                onChange={(e) => setConfig({...config, dashboard_title: e.target.value})}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="dashboard_subtitle" className="text-zinc-400">Subtítulo</Label>
              <Textarea
                id="dashboard_subtitle"
                value={config.dashboard_subtitle}
                onChange={(e) => setConfig({...config, dashboard_subtitle: e.target.value})}
                className="bg-zinc-800 border-zinc-700 text-white h-20"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Adicionais */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Mensagens Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="welcome_message" className="text-zinc-400">Mensagem de Boas-vindas</Label>
            <Textarea
              id="welcome_message"
              value={config.welcome_message}
              onChange={(e) => setConfig({...config, welcome_message: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white h-24"
              placeholder="Digite a mensagem que aparecerá para novos usuários..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Preview das Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-zinc-800 p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-black">+</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{config.platform_name}</h3>
                <p className="text-sm text-zinc-400">{config.platform_tagline}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {config.dashboard_title}
              </h1>
              <p className="text-zinc-400">
                {config.dashboard_subtitle}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}