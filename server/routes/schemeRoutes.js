const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/schemes', schemeController.getAllSchemes);
router.get('/schemes/type/:type', schemeController.getSchemesByType);
router.get('/schemes/:id', schemeController.getSchemeById);

// Protected routes (require authentication)
router.post('/schemes/apply', authMiddleware, schemeController.applyForScheme);
router.get('/schemes/applications/my', authMiddleware, schemeController.getUserApplications);

// Admin routes
router.post('/admin/schemes', authMiddleware, schemeController.createScheme);
router.put('/admin/schemes/:id', authMiddleware, schemeController.updateScheme);
router.delete('/admin/schemes/:id', authMiddleware, schemeController.deleteScheme);
router.get('/admin/schemes/applications', authMiddleware, schemeController.getAllApplications);
router.put('/admin/schemes/applications/:id', authMiddleware, schemeController.updateApplicationStatus);

module.exports = router;
