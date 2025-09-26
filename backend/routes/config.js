const express = require('express');
const router = express.Router();
const { getConfig, updateConfig } = require('../controllers/configController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rotas públicas
router.get('/', getConfig);

// Rotas protegidas para administradores
router.put('/', authenticateToken, requireAdmin, updateConfig);

module.exports = router;
