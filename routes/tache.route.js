const express = require('express');
const router = express.Router();
const taskController = require('../controllers/control.tache');
const auth = require('../muddlewares/admin');
const adminOnly = require('../muddlewares/adminOnly');

// Routes protégées par authentification
router.get('/', auth, taskController.lister);
router.get('/:id', auth, taskController.detail);
router.put('/:id', auth, taskController.modifier);

// Routes pour commentaires et historique
router.post('/:id/commentaires', auth, taskController.ajouterCommentaire);
router.get('/:id/historique', auth, taskController.obtenirHistorique);

// Routes réservées aux admins
router.post('/', auth, adminOnly, taskController.creer);
router.delete('/:id', auth, adminOnly, taskController.supprimer);

module.exports = router;
