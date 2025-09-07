const express = require('express');
const router = express.Router();
const messageController = require('../controllers/control.message');
const auth = require('../muddlewares/admin');
const upload = require('../muddlewares/upload');

// Toutes les routes nécessitent une authentification
router.use(auth);

// Envoyer un message
router.post('/', upload.single('pieceJointe'), messageController.envoyerMessage);

// Récupérer les messages reçus
router.get('/recus', messageController.getMessagesRecus);

// Récupérer les messages envoyés
router.get('/envoyes', messageController.getMessagesEnvoyes);

// Marquer un message comme lu
router.patch('/:id/lu', messageController.marquerCommeLu);

// Supprimer un message
router.delete('/:id', messageController.supprimerMessage);

// Récupérer la boîte de réception (non lus + récents)
router.get('/boite-reception', messageController.getBoiteReception);

// Récupérer le nombre de messages non lus
router.get('/non-lus/count', messageController.getNombreMessagesNonLus);

module.exports = router;
