const Task = require("../models/mode.tache");

exports.creer = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const { titre, description, assigne, priorite, statut, dateEcheance } =
      req.body;

    const task = new Task({
      titre,
      description,
      assigne: assigne || null,
      priorite,
      statut,
      dateEcheance: dateEcheance || null,
      creePar: req.user.id
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error("Erreur création task:", err);
    res.status(500).json({ error: "Erreur création task" });
  }
};

exports.lister = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    let sort = { creeLe: -1 }; // correspond à ton schéma

    if (req.query.sort) {
      const [field, order] = req.query.sort.split(":");
      sort = { [field]: order === "desc" ? -1 : 1 };
    }

    const filter = {};
    if (req.query.priorite) filter.priorite = req.query.priorite;
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.assigne) filter.assigne = req.query.assigne;

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate("assigne", "nom poste email")
      .populate("creePar", "nom email role")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: tasks,
    });
  } catch (err) {
    console.error("Erreur récupération tasks:", err);
    res.status(500).json({ error: "Erreur récupération tasks" });
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
    const update = {
      titre: req.body.titre,
      description: req.body.description,
      assigne: req.body.assigne,
      priorite: req.body.priorite,
      statut: req.body.statut,
      dateEcheance: req.body.dateEcheance,
    };

    const task = await Task.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!task) return res.status(404).json({ error: "Introuvable" });
    res.json(task);
  } catch (err) {
    console.error("Erreur modification", err);
    res.status(500).json({ error: "Erreur modification" });
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
