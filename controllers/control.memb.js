const Member= require('../models/model.memb')

exports.creer = async (req, res) => {
  try {
    console.log('req.body', req.body);
    console.log('req.file', req.file);
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
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
  }
};

exports.detail = async (req, res) => {
  try {
    const m = await Member.findById(req.params.id);
    if (!m) return res.status(404).json({ error: 'Introuvable' });
    res.json(m);
  } catch (err) {
    res.status(500).json({ error: 'Erreur' });
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
