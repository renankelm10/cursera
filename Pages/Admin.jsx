import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Course } from "@/entities/Course";
import { Lesson } from "@/entities/Lesson";
import { BannerImage } from "@/entities/BannerImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, BookOpen, Users, Video, Image, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import CourseManager from "../components/admin/CourseManager";
import LessonManager from "../components/admin/LessonManager";
import UserManager from "../components/admin/UserManager";
import BannerManager from "../components/admin/BannerManager";
import ConfigManager from "../components/admin/ConfigManager";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLessons: 0,
    totalUsers: 0,
    totalBannerImages: 0
  });

  const loadStats = useCallback(async () => {
    try {
      const [courses, lessons, users, bannerImages] = await Promise.all([
        Course.list(),
        Lesson.list(),
        User.list(),
        BannerImage.list()
      ]);
      
      setStats({
        totalCourses: courses.length,
        totalLessons: lessons.length,
        totalUsers: users.length,
        totalBannerImages: bannerImages.length
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
    setLoading(false);
  }, []);

  const checkAdminAccess = useCallback(async () => {
    try {
      const userData = await User.me();
      
      if (!userData || userData.is_admin !== true) {
        console.log("Access denied - not admin:", userData);
        navigate(createPageUrl("Dashboard"));
        return;
      }
      
      setUser(userData);
      await loadStats();
    } catch (error) {
      console.log("Error checking admin access:", error);
      navigate(createPageUrl("Dashboard"));
    }
  }, [navigate, loadStats]);

  useEffect(() => {
    checkAdminAccess();
  }, [checkAdminAccess]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-4xl font-bold text-white">Painel Administrativo</h1>
          </div>
          <p className="text-zinc-400 text-lg">
            Gerencie cursos, aulas, usuários, banner e configurações da plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total de Cursos</p>
                  <p className="text-3xl font-bold text-white">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total de Aulas</p>
                  <p className="text-3xl font-bold text-white">{stats.totalLessons}</p>
                </div>
                <Video className="w-12 h-12 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total de Usuários</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Imagens Banner</p>
                  <p className="text-3xl font-bold text-white">{stats.totalBannerImages}</p>
                </div>
                <Image className="w-12 h-12 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-800">
            <TabsTrigger value="courses" className="data-[state=active]:bg-blue-600">
              Cursos
            </TabsTrigger>
            <TabsTrigger value="lessons" className="data-[state=active]:bg-green-600">
              Aulas
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="banner" className="data-[state=active]:bg-orange-600">
              Banner
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-pink-600">
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <CourseManager onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="lessons" className="mt-6">
            <LessonManager onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManager onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="banner" className="mt-6">
            <BannerManager onStatsUpdate={loadStats} />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <ConfigManager onStatsUpdate={loadStats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}