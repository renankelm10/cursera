const express = require('express');
const router = express.Router();
const {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  markLessonComplete
} = require('../controllers/lessonsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);

// Rotas protegidas para usuários autenticados
router.post('/:id/complete', authenticateToken, markLessonComplete);

// Rotas protegidas para administradores
router.post('/', authenticateToken, requireAdmin, createLesson);
router.put('/:id', authenticateToken, requireAdmin, updateLesson);
router.delete('/:id', authenticateToken, requireAdmin, deleteLesson);

module.exports = router;
