const Task = require("../models/mode.tache");

exports.creer = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const { titre, description, assigne, priorite, statut, dateEcheance } =
      req.body;

    // Convertir assigne en tableau si ce n'est pas déjà le cas
    let assigneArray = [];
    if (assigne) {
      assigneArray = Array.isArray(assigne) ? assigne : [assigne];
    }

    const task = new Task({
      titre,
      description,
      assigne: assigneArray,
      priorite,
      statut,
      dateEcheance: dateEcheance || null,
      creePar: req.user.id,
      historique: [{
        action: 'Tâche créée',
        auteur: req.user.id,
        details: `Tâche "${titre}" créée`,
        date: new Date()
      }]
    });

    await task.save();
    
    // Populer les références pour la réponse
    await task.populate('assigne', 'nom email poste');
    await task.populate('creePar', 'nom email');
    
    res.status(201).json(task);
  } catch (err) {
    console.error("Erreur création task:", err);
    res.status(500).json({ error: "Erreur création task" });
  }
};

exports.lister = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10)); // Limiter à 50 max
    const skip = (page - 1) * limit;

    // Tous les utilisateurs voient toutes les tâches
    let filter = {};
    
    // Optionnel: Filtrer par recherche si un terme de recherche est fourni
    if (req.query.search) {
      const searchTerm = new RegExp(req.query.search, 'i');
      filter.$or = [
        { titre: searchTerm },
        { description: searchTerm }
      ];
    }

    // Optimiser la requête avec projection et lean()
    const tasksPromise = Task.find(filter)
      .select('titre statut priorite dateEcheance assigne creeLe creePar') // Sélection explicite des champs
      .populate('assigne', 'nom photo') // Limiter les champs populés
      .populate('creePar', 'nom')
      .sort({ creeLe: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Utiliser lean() pour des performances accrues

    // Utiliser countDocuments avec le même filtre pour un comptage précis
    const countPromise = Task.countDocuments(filter);

    // Exécuter les requêtes en parallèle
    const [tasks, total] = await Promise.all([tasksPromise, countPromise]);
    
    const totalPages = Math.ceil(total / limit);

    res.json({
      tasks,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error("Erreur liste tasks:", err);
    res.status(500).json({ error: "Erreur liste tasks" });
  }
};

exports.detail = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assigne", "nom poste email")
      .populate("creePar","email role");
    if (!task) return res.status(404).json({ error: "Introuvable" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Erreur" });
  }
};

exports.modifier = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const oldTask = await Task.findById(id);

    if (!oldTask) {
      return res.status(404).json({ error: "Task non trouvée" });
    }

    // Ajouter à l'historique si le statut change
    if (updates.statut && updates.statut !== oldTask.statut) {
      const historyEntry = {
        action: 'Statut modifié',
        auteur: req.user.id,
        details: `Statut changé de "${oldTask.statut}" vers "${updates.statut}"`,
        date: new Date()
      };
      
      if (!oldTask.historique) {
        oldTask.historique = [];
      }
      oldTask.historique.push(historyEntry);
      updates.historique = oldTask.historique;
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate('assigne', 'nom email poste photo')
      .populate('creePar', 'nom email')
      .populate('commentaires.auteur', 'nom email');

    res.json(task);
  } catch (err) {
    console.error("Erreur modification task:", err);
    res.status(500).json({ error: "Erreur modification task" });
  }
};

exports.supprimer = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Introuvable" });
    res.json({ message: "Tâche supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression" });
  }
};

// Ajouter un commentaire à une tâche
exports.ajouterCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: "Le message ne peut pas être vide" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    const nouveauCommentaire = {
      auteur: req.user.id,
      message: message.trim(),
      creeLe: new Date()
    };

    task.commentaires.push(nouveauCommentaire);
    
    // Ajouter à l'historique
    task.historique.push({
      action: 'Commentaire ajouté',
      auteur: req.user.id,
      details: `Commentaire: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      date: new Date()
    });

    await task.save();
    
    // Populer et retourner la tâche mise à jour
    await task.populate('commentaires.auteur', 'nom email photo');
    await task.populate('assigne', 'nom email poste photo');
    await task.populate('creePar', 'nom email');
    
    res.json(task);
  } catch (err) {
    console.error("Erreur ajout commentaire:", err);
    res.status(500).json({ error: "Erreur ajout commentaire" });
  }
};

// Obtenir l'historique d'une tâche
exports.obtenirHistorique = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findById(id)
      .populate('historique.auteur', 'nom email')
      .select('historique titre');
      
    if (!task) {
      return res.status(404).json({ error: "Tâche non trouvée" });
    }

    res.json({
      titre: task.titre,
      historique: task.historique.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (err) {
    console.error("Erreur récupération historique:", err);
    res.status(500).json({ error: "Erreur récupération historique" });
  }
};
