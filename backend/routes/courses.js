const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse
} = require('../controllers/coursesController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Rotas protegidas para usuários autenticados
router.post('/:courseId/enroll', authenticateToken, enrollInCourse);

// Rotas protegidas para administradores
router.post('/', authenticateToken, requireAdmin, createCourse);
router.put('/:id', authenticateToken, requireAdmin, updateCourse);
router.delete('/:id', authenticateToken, requireAdmin, deleteCourse);

module.exports = router;
