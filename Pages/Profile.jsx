import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Course } from "@/entities/Course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, User as UserIcon, Mail } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    interests: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        full_name: userData.full_name || "",
        bio: userData.bio || "",
        interests: userData.interests || ""
      });

      // Load user courses (mock data for now since we don't have enrollments)
      const allCourses = await Course.list();
      setCourses(allCourses.slice(0, 3)); // Show first 3 as enrolled
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      await User.updateMyUserData(formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Meu Perfil</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.full_name?.charAt(0) || "U"}
                    </span>
                  </div>
                  
                  {isEditing ?
                  <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name" className="text-zinc-400">Nome</Label>
                        <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white mt-1" />

                      </div>
                      
                      <div>
                        <Label htmlFor="bio" className="text-zinc-400">Bio</Label>
                        <Input
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="Conte um pouco sobre você..."
                        className="bg-zinc-800 border-zinc-700 text-white mt-1" />

                      </div>
                      
                      <div>
                        <Label htmlFor="interests" className="text-zinc-400">Interesses</Label>
                        <Input
                        id="interests"
                        value={formData.interests}
                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                        placeholder="Ex: programação, design, marketing"
                        className="bg-zinc-800 border-zinc-700 text-white mt-1" />

                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                          Salvar
                        </Button>
                        <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300">

                          Cancelar
                        </Button>
                      </div>
                    </div> :

                  <div>
                      <h2 className="text-xl font-bold text-white mb-2">
                        {user?.full_name || "Usuário"}
                      </h2>
                      
                      <div className="flex items-center justify-center gap-2 mb-4 text-zinc-400">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">{user?.email}</span>
                      </div>

                      {user?.bio &&
                    <p className="text-zinc-400 mb-4">{user.bio}</p>
                    }

                      {user?.interests &&
                    <div className="mb-4">
                          <p className="text-sm text-zinc-500 mb-2">Interesses:</p>
                          <div className="flex flex-wrap gap-2">
                            {user.interests.split(',').map((interest, index) =>
                        <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400">
                                {interest.trim()}
                              </Badge>
                        )}
                          </div>
                        </div>
                    }

                      <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:border-zinc-600">

                        Editar Perfil
                      </Button>
                    </div>
                  }
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{courses.length}</p>
                  <p className="text-sm text-zinc-400">Cursos</p>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {courses.reduce((total, course) => total + (course.duration_hours || 0), 0)}h
                  </p>
                  <p className="text-sm text-zinc-400">Estudadas</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Progress */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Meus Cursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {courses.length > 0 ?
                <div className="space-y-4">
                    {courses.map((course) =>
                  <div key={course.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">{course.title}</h3>
                            <p className="text-zinc-400 text-sm mb-2 line-clamp-1">
                              {course.description}
                            </p>
                            
                            <div className="flex items-center gap-4 mb-3">
                              {course.instructor &&
                          <span className="text-xs text-zinc-500">
                                  {course.instructor}
                                </span>
                          }
                              {course.duration_hours &&
                          <span className="text-xs text-zinc-500">
                                  {course.duration_hours}h
                                </span>
                          }
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                <span>Progresso</span>
                                <span>75%</span>
                              </div>
                              <div className="w-full bg-zinc-700 rounded-full h-2">
                                <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: '75%' }}>
                            </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                Em andamento
                              </Badge>
                              <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-300">
                                Continuar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                  )}
                  </div> :

                <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 mb-4">Você ainda não se inscreveu em nenhum curso</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Explorar Cursos
                    </Button>
                  </div>
                }
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-zinc-900 border-zinc-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Conquistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 text-center">
                    <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="font-medium text-white">Primeiro Curso</p>
                    <p className="text-xs text-zinc-400">Complete seu primeiro curso</p>
                  </div>
                  
                  <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 text-center opacity-50">
                    <Award className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="font-medium text-zinc-400">Estudante Dedicado</p>
                    <p className="text-xs text-zinc-500">Estude 10 horas</p>
                  </div>
                  
                  <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 text-center opacity-50">
                    <Award className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                    <p className="font-medium text-zinc-400">Expert</p>
                    <p className="text-xs text-zinc-500">Complete 5 cursos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}