import React, { useState, useEffect } from "react";
import { BannerImage } from "@/entities/BannerImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, X, Image, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function BannerManager({ onStatsUpdate }) {
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    image_url: "",
    link_url: "",
    order: "",
    is_active: true
  });

  useEffect(() => {
    loadBannerImages();
  }, []);

  const loadBannerImages = async () => {
    const data = await BannerImage.list("order");
    setBannerImages(data);
    setLoading(false);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      image_url: banner.image_url || "",
      link_url: banner.link_url || "",
      order: banner.order || "",
      is_active: banner.is_active || true
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      image_url: "",
      link_url: "",
      order: bannerImages.length + 1,
      is_active: true
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    const bannerData = {
      ...formData,
      order: formData.order ? Number(formData.order) : bannerImages.length + 1
    };

    if (editingBanner) {
      await BannerImage.update(editingBanner.id, bannerData);
    } else {
      await BannerImage.create(bannerData);
    }

    setShowDialog(false);
    loadBannerImages();
    onStatsUpdate?.();
  };

  const handleDelete = async (bannerId) => {
    if (window.confirm("Tem certeza que deseja excluir esta imagem do banner?")) {
      await BannerImage.delete(bannerId);
      loadBannerImages();
      onStatsUpdate?.();
    }
  };

  const toggleActive = async (banner) => {
    await BannerImage.update(banner.id, { ...banner, is_active: !banner.is_active });
    loadBannerImages();
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Banner</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingBanner ? "Editar Imagem do Banner" : "Nova Imagem do Banner"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title" className="text-zinc-400">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="image_url" className="text-zinc-400">URL da Imagem</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="link_url" className="text-zinc-400">URL de Destino (Opcional)</Label>
                <Input
                  id="link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order" className="text-zinc-400">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                  />
                  <Label htmlFor="is_active" className="text-zinc-400">
                    Imagem ativa
                  </Label>
                </div>
              </div>

              {/* Preview da imagem */}
              {formData.image_url && (
                <div>
                  <Label className="text-zinc-400">Preview</Label>
                  <div className="mt-2 w-full h-32 bg-zinc-800 rounded-lg overflow-hidden">
                    <img 
                      src={formData.image_url} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 hidden">
                      <Image className="w-8 h-8" />
                      <span className="ml-2">Erro ao carregar imagem</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {bannerImages.map((banner) => (
          <Card key={banner.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-24 h-16 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Image className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-white">{banner.title}</h3>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                      Ordem: {banner.order}
                    </Badge>
                    {banner.is_active ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <Eye className="w-3 h-3 mr-1" />
                        Ativa
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Inativa
                      </Badge>
                    )}
                  </div>
                  
                  {banner.link_url && (
                    <p className="text-zinc-400 text-sm mb-2">
                      Link: {banner.link_url}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => toggleActive(banner)}
                      className="border-zinc-700"
                    >
                      {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(banner.id)}>
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bannerImages.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">Nenhuma imagem de banner criada ainda</p>
        </div>
      )}
    </div>
  );
}