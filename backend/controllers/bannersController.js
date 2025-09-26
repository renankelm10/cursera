const supabase = require('../config/supabase');

const getAllBanners = async (req, res) => {
  try {
    const { data: banners, error } = await supabase
      .from('banner_images')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar banners:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ banners });
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getAllBannersAdmin = async (req, res) => {
  try {
    const { data: banners, error } = await supabase
      .from('banner_images')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar banners:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ banners });
  } catch (error) {
    console.error('Erro ao buscar banners:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: banner, error } = await supabase
      .from('banner_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !banner) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }

    res.json({ banner });
  } catch (error) {
    console.error('Erro ao buscar banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const createBanner = async (req, res) => {
  try {
    const {
      title,
      image_url,
      link_url,
      is_active,
      order_index
    } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Título e URL da imagem são obrigatórios' });
    }

    const { data: banner, error } = await supabase
      .from('banner_images')
      .insert([
        {
          title,
          image_url,
          link_url,
          is_active: is_active !== undefined ? is_active : true,
          order_index: order_index || 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar banner:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.status(201).json({
      message: 'Banner criado com sucesso',
      banner
    });
  } catch (error) {
    console.error('Erro ao criar banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data: banner, error } = await supabase
      .from('banner_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar banner:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    if (!banner) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }

    res.json({
      message: 'Banner atualizado com sucesso',
      banner
    });
  } catch (error) {
    console.error('Erro ao atualizar banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('banner_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar banner:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }

    res.json({ message: 'Banner deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar banner:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  getAllBanners,
  getAllBannersAdmin,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
};
