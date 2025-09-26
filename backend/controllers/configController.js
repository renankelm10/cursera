const supabase = require('../config/supabase');

const getConfig = async (req, res) => {
  try {
    const { data: config, error } = await supabase
      .from('platform_config')
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao buscar configuração:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!config) {
      // Se não existe configuração, criar uma padrão
      const { data: newConfig, error: createError } = await supabase
        .from('platform_config')
        .insert([
          {
            platform_name: 'RotaMed',
            platform_tagline: 'Sua melhor rota para a medicina!',
            dashboard_title: 'Descubra novos conhecimentos',
            dashboard_subtitle: 'Explore nossa coleção de cursos - todos liberados!',
            welcome_message: 'Bem-vindo à nossa plataforma de ensino!'
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar configuração padrão:', createError);
        return res.status(500).json({ error: 'Erro interno do servidor' });
      }

      return res.json({ config: newConfig });
    }

    res.json({ config });
  } catch (error) {
    console.error('Erro ao buscar configuração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateConfig = async (req, res) => {
  try {
    const {
      platform_name,
      platform_tagline,
      dashboard_title,
      dashboard_subtitle,
      welcome_message
    } = req.body;

    // Primeiro, tentar buscar a configuração existente
    const { data: existingConfig } = await supabase
      .from('platform_config')
      .select('id')
      .single();

    let config;
    let error;

    if (existingConfig) {
      // Atualizar configuração existente
      const result = await supabase
        .from('platform_config')
        .update({
          platform_name,
          platform_tagline,
          dashboard_title,
          dashboard_subtitle,
          welcome_message
        })
        .eq('id', existingConfig.id)
        .select()
        .single();
      
      config = result.data;
      error = result.error;
    } else {
      // Criar nova configuração
      const result = await supabase
        .from('platform_config')
        .insert([
          {
            platform_name,
            platform_tagline,
            dashboard_title,
            dashboard_subtitle,
            welcome_message
          }
        ])
        .select()
        .single();
      
      config = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Erro ao atualizar configuração:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({
      message: 'Configuração atualizada com sucesso',
      config
    });
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getConfig,
  updateConfig
};
