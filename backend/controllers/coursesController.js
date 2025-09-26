const supabase = require('../config/supabase');

const getAllCourses = async (req, res) => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar cursos:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ courses });
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (
          id,
          title,
          description,
          duration_minutes,
          order_index,
          is_free
        )
      `)
      .eq('id', id)
      .single();

    if (error || !course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Ordenar aulas por order_index
    if (course.lessons) {
      course.lessons.sort((a, b) => a.order_index - b.order_index);
    }

    res.json({ course });
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      level,
      thumbnail_url,
      duration_hours,
      instructor,
      is_preview,
      purchase_url,
      rating
    } = req.body;

    if (!title || !description || !category || !level) {
      return res.status(400).json({ error: 'Título, descrição, categoria e nível são obrigatórios' });
    }

    const { data: course, error } = await supabase
      .from('courses')
      .insert([
        {
          title,
          description,
          category,
          level,
          thumbnail_url,
          duration_hours,
          instructor,
          is_preview: is_preview || false,
          purchase_url,
          rating
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar curso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.status(201).json({
      message: 'Curso criado com sucesso',
      course
    });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: course, error } = await supabase
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar curso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    res.json({
      message: 'Curso atualizado com sucesso',
      course
    });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar curso:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ message: 'Curso deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Verificar se o curso existe
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    // Verificar se já está matriculado
    const { data: existingEnrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Usuário já está matriculado neste curso' });
    }

    // Criar matrícula
    const { data: enrollment, error } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: userId,
          course_id: courseId
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao matricular usuário:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    // Atualizar contador de estudantes
    await supabase.rpc('increment_students_count', { course_id: courseId });

    res.status(201).json({
      message: 'Matrícula realizada com sucesso',
      enrollment
    });
  } catch (error) {
    console.error('Erro ao matricular usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse
};
