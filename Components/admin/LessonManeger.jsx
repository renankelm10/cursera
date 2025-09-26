import React, { useState, useEffect } from "react";
import { Lesson } from "@/entities/Lesson";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Save, X, Video } from "lucide-react";

export default function LessonManager({ onStatsUpdate }) {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    order: "",
    duration_minutes: "",
    video_url: "",
    content: "",
    is_free: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [lessonsData, coursesData] = await Promise.all([
      Lesson.list("order"),
      Course.list()
    ]);
    setLessons(lessonsData);
    setCourses(coursesData);
    setLoading(false);
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : "Curso não encontrado";
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title || "",
      description: lesson.description || "",
      course_id: lesson.course_id || "",
      order: lesson.order || "",
      duration_minutes: lesson.duration_minutes || "",
      video_url: lesson.video_url || "",
      content: lesson.content || "",
      is_free: lesson.is_free || true
    });
    setShowDialog(true);
  };

  const handleNew = () => {
    setEditingLesson(null);
    setFormData({
      title: "",
      description: "",
      course_id: "",
      order: "",
      duration_minutes: "",
      video_url: "",
      content: "",
      is_free: true
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    const lessonData = {
      ...formData,
      order: formData.order ? Number(formData.order) : null,
      duration_minutes: formData.duration_minutes ? Number(formData.duration_minutes) : null
    };

    if (editingLesson) {
      await Lesson.update(editingLesson.id, lessonData);
    } else {
      await Lesson.create(lessonData);
    }

    setShowDialog(false);
    loadData();
    onStatsUpdate?.();
  };

  const handleDelete = async (lessonId) => {
    if (window.confirm("Tem certeza que deseja excluir esta aula?")) {
      await Lesson.delete(lessonId);
      loadData();
      onStatsUpdate?.();
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-zinc-400">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gerenciar Aulas</h2>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={handleNew} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingLesson ? "Editar Aula" : "Nova Aula"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="course_id" className="text-zinc-400">Curso</Label>
                <Select value={formData.course_id} onValueChange={(value) => setFormData({...formData, course_id: value})}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id} className="text-white">
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="order" className="text-zinc-400">Ordem</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-zinc-400">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration_minutes" className="text-zinc-400">Duração (minutos)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id="is_free"
                    checked={formData.is_free}
                    onCheckedChange={(checked) => setFormData({...formData, is_free: checked})}
                  />
                  <Label htmlFor="is_free" className="text-zinc-400">
                    Aula gratuita
                  </Label>
                </div>
              </div>
              
              <div>
                <Label htmlFor="video_url" className="text-zinc-400">URL do Vídeo</Label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <Label htmlFor="content" className="text-zinc-400">Conteúdo Adicional</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white h-32"
                  placeholder="Notas, materiais complementares, etc..."
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

      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-green-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{lesson.title}</h3>
                      {lesson.is_free && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                          Gratuita
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-zinc-400 mb-2">
                      Curso: {getCourseTitle(lesson.course_id)}
                    </p>
                    
                    {lesson.description && (
                      <p className="text-zinc-300 text-sm mb-2">{lesson.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>Aula #{lesson.order}</span>
                      {lesson.duration_minutes && (
                        <span>{lesson.duration_minutes} minutos</span>
                      )}
                      {lesson.video_url && (
                        <span className="text-green-400">Vídeo disponível</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(lesson)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(lesson.id)}>
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-400">Nenhuma aula criada ainda</p>
        </div>
      )}
    </div>
  );
}