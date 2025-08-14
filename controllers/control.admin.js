const User = require("../models/model.admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const email = req.body.email && req.body.email.toLowerCase();
    const { motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ error: "Email et motDePasse requis" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ error: "Utilisateur existe déjà" });
    }

    const user = new User({ email, motDePasse });
    await user.save();

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id }, // payload
      process.env.JWT_SECRET, // clé secrète
      { expiresIn: "7d" } // expiration (7 jours)
    );

    res.status(201).json({
      message: "Utilisateur créé",
      user,
      token,
    });
  } catch (err) {
    console.error("Erreur d'enregistrement", err);
    res.status(500).json({ error: "Erreur enregistrement" });
  }
};

exports.login = async (req, res) => {
  try {
    const email = req.body.email && req.body.email.toLowerCase();
    const { motDePasse } = req.body;
    if (!email || !motDePasse)
      return res.status(400).json({ error: "Email et motDePasse requis" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
    const ok = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!ok) return res.status(401).json({ error: "Mot de passe incorrect" });
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({ token });
  } catch (err) {
    console.error("Erreur connexion:", err);
    res.status(500).json({ error: "Erreur connexion" });
  }
};
