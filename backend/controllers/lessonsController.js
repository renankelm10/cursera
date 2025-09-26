const supabase = require('../config/supabase');

const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar aulas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ lessons });
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .select(`
        *,
        courses (
          id,
          title,
          instructor
        )
      `)
      .eq('id', id)
      .single();

    if (error || !lesson) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }

    res.json({ lesson });
  } catch (error) {
    console.error('Erro ao buscar aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createLesson = async (req, res) => {
  try {
    const {
      course_id,
      title,
      description,
      video_url,
      duration_minutes,
      order_index,
      is_free
    } = req.body;

    if (!course_id || !title || order_index === undefined) {
      return res.status(400).json({ error: 'ID do curso, título e índice de ordem são obrigatórios' });
    }

    // Verificar se o curso existe
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', course_id)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }

    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert([
        {
          course_id,
          title,
          description,
          video_url,
          duration_minutes,
          order_index,
          is_free: is_free || false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar aula:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.status(201).json({
      message: 'Aula criada com sucesso',
      lesson
    });
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: lesson, error } = await supabase
      .from('lessons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar aula:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!lesson) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }

    res.json({
      message: 'Aula atualizada com sucesso',
      lesson
    });
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar aula:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ message: 'Aula deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se a aula existe
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', id)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }

    // Inserir ou atualizar progresso
    const { data: progress, error } = await supabase
      .from('user_progress')
      .upsert([
        {
          user_id: userId,
          lesson_id: id,
          completed: true,
          completed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao marcar aula como completa:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({
      message: 'Aula marcada como completa',
      progress
    });
  } catch (error) {
    console.error('Erro ao marcar aula como completa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  markLessonComplete
};
