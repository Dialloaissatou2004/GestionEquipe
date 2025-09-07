const Message = require('../models/model.message');
const User = require('../models/model.admin');

// Envoyer un message
exports.envoyerMessage = async (req, res) => {
  try {
    const { destinataireId, objet, contenu, priorite } = req.body;
    
    // Vérifier que le destinataire existe
    const destinataire = await User.findById(destinataireId);
    if (!destinataire) {
      return res.status(404).json({ error: 'Destinataire non trouvé' });
    }

    const nouveauMessage = await Message.create({
      expediteur: req.user.id,
      destinataire: destinataireId,
      objet,
      contenu,
      priorite: priorite || 'moyenne',
      pieceJointe: req.file ? req.file.path : null
    });

    // Populer les données de l'expéditeur et du destinataire
    await nouveauMessage.populate('expediteur', 'nom email photo');
    await nouveauMessage.populate('destinataire', 'nom email photo');

    res.status(201).json({
      status: 'success',
      data: {
        message: nouveauMessage
      }
    });
  } catch (err) {
    console.error('Erreur envoi message:', err);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};

// Récupérer les messages reçus
exports.getMessagesRecus = async (req, res) => {
  try {
    const messages = await Message.find({ destinataire: req.user.id })
      .sort('-createdAt')
      .populate('expediteur', 'nom email photo');

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages
      }
    });
  } catch (err) {
    console.error('Erreur récupération messages reçus:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

// Récupérer les messages envoyés
exports.getMessagesEnvoyes = async (req, res) => {
  try {
    const messages = await Message.find({ expediteur: req.user.id })
      .sort('-createdAt')
      .populate('destinataire', 'nom email photo');

    res.status(200).json({
      status: 'success',
      results: messages.length,
      data: {
        messages
      }
    });
  } catch (err) {
    console.error('Erreur récupération messages envoyés:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages envoyés' });
  }
};

// Marquer un message comme lu
exports.marquerCommeLu = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { lu: true },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        message
      }
    });
  } catch (err) {
    console.error('Erreur marquage message comme lu:', err);
    res.status(500).json({ error: 'Erreur lors du marquage du message comme lu' });
  }
};

// Supprimer un message
exports.supprimerMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.error('Erreur suppression message:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
};

// Récupérer la boîte de réception avec les messages non lus en premier
exports.getBoiteReception = async (req, res) => {
  try {
    // Récupérer les messages non lus
    const nonLus = await Message.find({ 
      destinataire: req.user.id, 
      lu: false 
    })
    .sort('-createdAt')
    .populate('expediteur', 'nom email photo');

    // Récupérer les messages lus
    const lus = await Message.find({ 
      destinataire: req.user.id, 
      lu: true 
    })
    .sort('-createdAt')
    .limit(50) // Limiter pour éviter de surcharger
    .populate('expediteur', 'nom email photo');

    res.status(200).json({
      status: 'success',
      data: {
        nonLus,
        lus
      }
    });
  } catch (err) {
    console.error('Erreur récupération boîte de réception:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de la boîte de réception' });
  }
};

// Récupérer le nombre de messages non lus
exports.getNombreMessagesNonLus = async (req, res) => {
  try {
    const count = await Message.countDocuments({ 
      destinataire: req.user.id, 
      lu: false 
    });

    res.status(200).json({
      status: 'success',
      data: {
        count
      }
    });
  } catch (err) {
    console.error('Erreur comptage messages non lus:', err);
    res.status(500).json({ error: 'Erreur lors du comptage des messages non lus' });
  }
};
