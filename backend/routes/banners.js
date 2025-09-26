const express = require('express');
const router = express.Router();
const {
  getAllBanners,
  getAllBannersAdmin,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannersController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', getAllBanners);
router.get('/:id', getBannerById);

// Rotas protegidas para administradores
router.get('/admin/all', authenticateToken, requireAdmin, getAllBannersAdmin);
router.post('/', authenticateToken, requireAdmin, createBanner);
router.put('/:id', authenticateToken, requireAdmin, updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);

module.exports = router;
