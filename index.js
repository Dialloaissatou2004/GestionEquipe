require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

// Configuration MongoDB Atlas
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "La variable d'environnement MONGO_URI n'est pas définie"
      );
    }

    console.log("Tentative de connexion à MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connexion à MongoDB Atlas réussie");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB Atlas:", error.message);
    if (process.env.MONGO_URI) {
      console.error(
        "URI utilisée:",
        process.env.MONGO_URI.replace(/:([^:]+)@/, ":***@")
      );
    }
    process.exit(1);
  }
};

connectDB();

const authRoutes = require("./routes/admin.route");
const memberRoutes = require("./routes/membre.route");
const messageRoutes = require("./routes/message.route");
const taskRoutes = require("./routes/tache.route");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Trop de requêtes depuis cette IP, veuillez réessayer plus tard.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    error: "Trop de tentatives de connexion, veuillez réessayer plus tard.",
  },
});

app.use(limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// Logging middleware
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Simple CORS configuration - allow all origins in development
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "http://localhost:5173",
          "http://127.0.0.1:5173",
          process.env.FRONTEND_URL,
        ].filter(Boolean)
      : true, // Allow all origins in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Configuration du parsing du JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging pour debug (uniquement en développement)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`\n--- ${new Date().toISOString()} ---`);
    console.log(`${req.method} ${req.path}`);
    console.log("Headers:", req.headers);
    if (req.method !== "GET") {
      console.log("Body:", req.body);
    }
    next();
  });
}

// Servir les fichiers statiques des uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'task-manager/dist')));
  
  // Catch-all handler pour les routes frontend (SPA)
  app.get('*', (req, res) => {
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'Route API non trouvée' });
    }
    res.sendFile(path.join(__dirname, 'task-manager/dist/index.html'));
  });
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);

// Route de test
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend fonctionne correctement",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ⚠️ 404 UNIQUEMENT pour les API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "Route API non trouvée",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Données invalides",
      details: err.message,
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Token invalide",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expiré",
    });
  }

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Erreur interne du serveur"
        : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🌍 Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`📊 Routes disponibles:`);
  console.log(`   - GET  /api/test`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/auth/users`);
  console.log(`   - GET  /api/tasks`);
  console.log(`   - POST /api/tasks`);
  console.log(`   - GET  /api/tasks/:id`);
  console.log(`   - PUT  /api/tasks/:id`);
  console.log(`   - DELETE /api/tasks/:id`);
  console.log(`   - GET  /api/members`);
  console.log(`   - POST /api/members`);
});
