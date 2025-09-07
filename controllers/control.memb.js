const Member= require('../models/model.memb')

exports.creer = async (req, res) => {
  try {
    // Vérifier si l'email existe déjà
    const existingMember = await Member.findOne({ email: req.body.email });
    if (existingMember) {
      return res.status(409).json({ 
        status: 409,
        message: 'Un membre avec cet email existe déjà'
      });
    }

    const photo = req.file ? '/uploads/' + req.file.filename : null;
    const { nom, poste, email } = req.body;
    const member = new Member({ nom, poste, email, photo });
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error('Erreur création member:', err);
    res.status(500).json({ error: 'Erreur création member' });
  }
};

exports.lister = async (req, res) => {
  try {
    const members = await Member.find();
    res.json({
      status: 200,
      message: 'Liste des membres récupérée',
      data: members
    });
  } catch (err) {
    console.error('Erreur liste des membres:', err);
    res.status(500).json({ 
      status: 500,
      message: 'Erreur serveur',
      error: err.message 
    });
  }
};

exports.detail = async (req, res) => {
  try {
    const m = await Member.findById(req.params.id);
    if (!m) return res.status(404).json({ message: 'Membre introuvable', status: 404 });
    res.json({ 
      status: 200,
      message: 'Membre trouvé',
      data: m
    });
  } catch (err) {
    console.error('Erreur détail membre:', err);
    res.status(500).json({ 
      status: 500,
      message: 'Erreur serveur',
      error: err.message 
    });
  }
};

exports.modifier = async (req, res) => {
  try {
    const update = { nom: req.body.nom, poste: req.body.poste, email: req.body.email };
    if (req.file) update.photo = '/uploads/' + req.file.filename;
    const updated = await Member.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification' });
  }
};

exports.supprimer = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression' });
  }
};
