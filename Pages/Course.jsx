
import React, { useState, useEffect, useCallback } from "react";
import { Course as CourseEntity } from "@/entities/Course";
import { Lesson } from "@/entities/Lesson";
import { User as UserEntity } from "@/entities/User"; // Added UserEntity import
import { ArrowLeft, Play, Clock, CheckCircle, Lock, Settings } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

// New Paywall Component
function Paywall({ course }) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-12 text-center">
        <Lock className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
        <p className="text-zinc-400 mb-6">
          Este é um curso exclusivo para membros com acesso pago.
        </p>
        <Button 
          asChild
          className="bg-green-600 hover:bg-green-700"
        >
          <a href={course.purchase_url} target="_blank" rel="noopener noreferrer">
            Liberar Acesso Agora
          </a>
        </Button>
        <p className="text-xs text-zinc-500 mt-4">
          Você será redirecionado para nossa plataforma de pagamento.
        </p>
      </CardContent>
    </Card>
  );
}

// New CourseContent Component (extracted from original CoursePage)
function CourseContent({ course, lessons }) { // Added 'course' prop as per outline
  const [selectedLesson, setSelectedLesson] = useState(lessons[0] || null);
  
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Video Player / Selected Lesson */}
      <div className="lg:col-span-2">
        {selectedLesson ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
                {selectedLesson.video_url ? (
                  <video 
                    controls 
                    controlsList="nodownload nofullscreen noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full rounded-t-lg"
                    src={selectedLesson.video_url}
                    preload="metadata"
                  >
                    Seu navegador não suporta vídeos
                  </video>
                ) : (
                  <div className="text-center text-zinc-400">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <p>Vídeo em breve</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedLesson.title}</h2>
                {selectedLesson.description && <p className="text-zinc-400 mb-4">{selectedLesson.description}</p>}
                {selectedLesson.content && (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-300">{selectedLesson.content}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-12 text-center">
              <Play className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-400">Selecione uma aula para começar</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lessons List */}
      <div>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Conteúdo do Curso</h3>
            <div className="space-y-2">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    selectedLesson?.id === lesson.id 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-750'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-700 text-xs font-medium">
                      <Play className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{lesson.title}</span>
                        {lesson.duration_minutes && (
                          <span className="text-xs text-zinc-500">
                            {lesson.duration_minutes}min
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">
                          Aula {lesson.order}
                        </span>
                        {/* Assuming lessons inside an accessible course are "Liberado" */}
                        <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                          Liberado
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {lessons.length === 0 && (
              <p className="text-zinc-400 text-center py-8">
                Nenhuma aula disponível ainda
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CoursePage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [user, setUser] = useState(null); // Added user state
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Changed default to false for security

  const loadCourseData = useCallback(async (courseId) => {
    try {
      // Load course details
      const courseData = await CourseEntity.list().then(courses => courses.find(c => c.id === courseId));
      setCourse(courseData);

      // Load lessons for this course
      const courseLessons = await Lesson.list().then(allLessons => allLessons
        .filter(lesson => lesson.course_id === courseId)
        .sort((a, b) => a.order - b.order));
      setLessons(courseLessons);
    } catch (error) {
      console.error("Error loading course data:", error);
    }
  }, [setCourse, setLessons]); // setCourse and setLessons are stable, but included for exhaustive-deps

  const loadInitialData = useCallback(async (courseId) => {
    try {
      // Attempt to load user data
      const userData = await UserEntity.me();
      setUser(userData);
      // For demonstration, update isAdmin based on user data
      // In a real app, this would be part of authentication context
      setIsAdmin(userData?.is_admin || false); 
    } catch(e) {
      console.log("User not logged in or session expired.", e);
      setUser(null); // Ensure user is null if not logged in
      setIsAdmin(false); // Ensure isAdmin is false if not logged in
    }
    await loadCourseData(courseId);
    setLoading(false);
  }, [loadCourseData, setUser, setIsAdmin, setLoading]); // All dependencies included

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");
    
    if (courseId) {
      loadInitialData(courseId); // Changed to loadInitialData
    }
  }, [loadInitialData]); // loadInitialData is now a dependency

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Curso não encontrado</h2>
          <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
            Voltar aos cursos
          </Button>
        </div>
      </div>
    );
  }
  
  // Determine if the user has access to the full course content
  const hasAccess = user?.is_admin || user?.has_paid_access || course?.is_preview;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Course Header */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl("Dashboard"))}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos cursos
            </Button>
            {isAdmin && ( // isAdmin still drives the admin button
              <Button
                variant="ghost"
                onClick={() => navigate(createPageUrl(`CourseAdmin?id=${course.id}`))}
                className="text-blue-400 hover:text-blue-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Painel Admin
              </Button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-500/20 text-blue-400">
                  {categories[course.category]}
                </Badge>
                <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                  {levels[course.level]}
                </Badge>
                {course.is_preview && <Badge className="bg-purple-500/20 text-purple-400">Prévia Gratuita</Badge>}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-zinc-400 text-lg mb-6">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-zinc-500">
                {course.duration_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {course.duration_hours} horas
                  </div>
                )}
                {course.instructor && (
                  <div>
                    Instrutor: <span className="text-white">{course.instructor}</span>
                  </div>
                )}
                <div>
                  {lessons.length} aula{lessons.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

            <div>
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                  
                  <div className="text-center mb-4">
                    {hasAccess ? (
                      <Badge className="bg-green-500/20 text-green-400 text-lg py-2 px-4">
                        ACESSO LIBERADO
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/20 text-red-400 text-lg py-2 px-4">
                        REQUER ACESSO PAGO
                      </Badge>
                    )}
                  </div>

                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    {hasAccess ? (
                      <button>Começar Agora</button>
                    ) : (
                      <a href={course.purchase_url} target="_blank" rel="noopener noreferrer">
                        Comprar Curso
                      </a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto p-6">
        {hasAccess ? (
          <CourseContent course={course} lessons={lessons} />
        ) : (
          <Paywall course={course} />
        )}
      </div>
    </div>
  );
}
