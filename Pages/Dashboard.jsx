import React, { useState, useEffect, useCallback } from "react";
import { Course } from "@/entities/Course";
import { PlatformConfig } from "@/entities/PlatformConfig";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, Users, Star, Play, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/entities/User";
import { Lock } from "lucide-react";

import BannerCarousel from "../components/BannerCarousel";

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

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [config, setConfig] = useState({
    dashboard_title: "Descubra novos conhecimentos",
    dashboard_subtitle: "Explore nossa coleção de cursos - todos liberados!"
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const loadCourses = useCallback(async () => {
    const data = await Course.list("-created_date");
    setCourses(data);
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      const configs = await PlatformConfig.list();
      if (configs.length > 0) {
        setConfig(configs[0]);
      }
    } catch (error) {
      console.error("Error loading platform config:", error);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch(e) {
      // Not logged in, user is null
    }
    await Promise.all([loadCourses(), loadConfig()]);
    setLoading(false);
  }, [loadCourses, loadConfig]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  const filterCourses = useCallback(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, selectedCategory, selectedLevel]);

  useEffect(() => {
    filterCourses();
  }, [filterCourses]);

  const getCoursesByCategory = (category) => {
    return filteredCourses.filter(course => course.category === category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Banner rotativo */}
      <BannerCarousel />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {config.dashboard_title}
          </h1>
          <p className="text-zinc-400 text-lg">
            {config.dashboard_subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-8 border border-zinc-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all">Todas as categorias</SelectItem>
                {Object.entries(categories).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                <SelectItem value="all">Todos os níveis</SelectItem>
                {Object.entries(levels).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-white">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Course Grid */}
        {selectedCategory === "all" ? (
          // Show courses by category
          Object.entries(categories).map(([categoryKey, categoryLabel]) => {
            const categoryCourses = getCoursesByCategory(categoryKey);
            if (categoryCourses.length === 0) return null;

            return (
              <div key={categoryKey} className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">{categoryLabel}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryCourses.map((course) => (
                    <CourseCard key={course.id} course={course} user={user} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Show filtered results
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} user={user} />
            ))}
          </div>
        )}

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">Nenhum curso encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, user }) {
  const hasAccess = user?.is_admin || user?.has_paid_access || course.is_preview;

  return (
    <Link to={createPageUrl(`Course?id=${course.id}`)}>
      <Card className={`group bg-zinc-900 border-zinc-800 hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden ${!hasAccess ? 'opacity-60' : ''}`}>
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Play className="w-12 h-12 text-white/80" />
            )}
          </div>
          {!hasAccess && (
            <div className="absolute top-3 right-3 bg-zinc-900/80 p-2 rounded-full">
              <Lock className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button className="bg-white text-black hover:bg-gray-200">
              <Play className="w-4 h-4 mr-2" />
              {hasAccess ? "Acessar Curso" : "Ver Prévia"}
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            >
              {categories[course.category]}
            </Badge>
            {course.is_preview && (
              <Badge className="bg-purple-500/20 text-purple-400">Prévia</Badge>
            )}
            <Badge
              variant="outline"
              className="border-zinc-700 text-zinc-400"
            >
              {levels[course.level]}
            </Badge>
          </div>

          <h3 className="font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {course.title}
          </h3>

          <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-sm text-zinc-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {course.duration_hours}h
            </div>

            {course.students_count && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.students_count}
              </div>
            )}

            {course.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {course.rating}
              </div>
            )}
          </div>

          {course.instructor && (
            <p className="text-zinc-400 text-xs mt-2">
              por {course.instructor}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}