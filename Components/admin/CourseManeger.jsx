
import React, { useState, useEffect } from "react";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const categories = {
  programacao: "Programação",
  design: "Design",
  marketing: "Marketing",
  negocios: "Negócios",
  dados: "Dados",
  idiomas: "Idiomas"
};

const levels = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado"
};

export default function CourseManager({ onStatsUpdate }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "programacao",
    level: "iniciante", 
    duration_hours: "",
    instructor: "",
    is_preview: false,
    purchase_url: "",
    rating: "",
    students_count: "",
    thumbnail_url: ""
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await Course.list("-created_date");
    setCourses(data);
    setLoading(false);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      category: course.category || "programacao",
      level: course.level || "iniciante",
      duration_hours: course.duration_hours || "",
      instructor: course.instructor || "",
      is_preview: course.is_preview || false,
      purchase_url: course.purchase_url || "",
      rating: course.rating || "",
      students_count: course.students_count || "",
      thumbnail_url: course.thumbnail_url || ""
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingCourse(null);
    setFormData({
      title: "",
      description: "",
      category: "programacao",
      level: "iniciante",
      duration_hours: "",
      instructor: "",
      is_preview: false,
      purchase_url: "",
      rating: "",
      students_count: "",
      thumbnail_url: ""
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    const courseData = {
      ...formData,
      duration_hours: formData.duration_hours ? Number(formData.duration_hours) : null,
      rating: formData.rating ? Number(formData.rating) : null,
      students_count: formData.students_count ? Number(formData.students_count) : null
    };
    // O campo 'price' foi removido, então não precisa mais ser processado.

    if (editingCourse) {
      await Course.update(editingCourse.id, courseData);
    } else {
      await Course.create(courseData);
    }

    setShowDialog(false);
    loadCourses();
    onStatsUpdate?.();
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Tem certeza que deseja excluir este curso?")) {
      await Course.delete(courseId);
      loadCourses();
      onStatsUpdate?.();
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Cursos</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCourse ? "Editar Curso" : "Novo Curso"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-zinc-400">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-zinc-400">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="category" className="text-zinc-400">Categoria</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {Object.entries(categories).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-white">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="level" className="text-zinc-400">Nível</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({...formData, level: value})}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {Object.entries(levels).map(([key, label]) => (
                      <SelectItem key={key} value={key} className="text-white">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration_hours" className="text-zinc-400">Duração (horas)</Label>
                <Input
                  id="duration_hours"
                  type="number"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData({...formData, duration_hours: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="instructor" className="text-zinc-400">Instrutor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="purchase_url" className="text-zinc-400">URL de Compra</Label>
                <Input
                  id="purchase_url"
                  value={formData.purchase_url}
                  onChange={(e) => setFormData({...formData, purchase_url: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://suapagina.com/comprar-curso"
                />
              </div>

              <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="is_preview"
                    checked={formData.is_preview}
                    onCheckedChange={(checked) => setFormData({...formData, is_preview: checked})}
                  />
                  <Label htmlFor="is_preview" className="text-zinc-400">
                    É uma prévia gratuita?
                  </Label>
              </div>
              
              <div>
                <Label htmlFor="rating" className="text-zinc-400">Avaliação (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="students_count" className="text-zinc-400">Número de Estudantes</Label>
                <Input
                  id="students_count"
                  type="number"
                  value={formData.students_count}
                  onChange={(e) => setFormData({...formData, students_count: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="thumbnail_url" className="text-zinc-400">URL da Imagem</Label>
                <Input
                  id="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://..."
                />
              </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-3">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-blue-500/20 text-blue-400">
                      {categories[course.category]}
                    </Badge>
                    <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                      {levels[course.level]}
                    </Badge>
                    {course.is_preview && (
                       <Badge className="bg-purple-500/20 text-purple-400">
                        Prévia
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-zinc-500">
                  {course.duration_hours}h • {course.instructor}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(course.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
