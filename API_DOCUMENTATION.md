# 🚀 API Cheat Sheet - Gestion de Projet

## 📍 URL de Déploiement
**Base URL:** `https://gestion-projet-aissatou.onrender.com/api`

## 🔐 Authentification
### Inscription
```bash
POST /api/auth/register
{
  "email": "admin@test.com",
  "motDePasse": "password123"
}
```

### Connexion
```bash
POST /api/auth/login
{
  "email": "admin@test.com",
  "motDePasse": "password123"
}
```

## 👥 Membres
### Lister
```bash
GET /api/members
```

### Créer
```bash
POST /api/members
# Headers: Authorization: Bearer TOKEN
# Form-data:
{
  "nom": "Jean Dupont",
  "poste": "Développeur",
  "email": "jean@test.com"
}
```

### Modifier
```bash
PUT /api/members/:id
# Headers: Authorization: Bearer TOKEN
# Form-data:
{
  "nom": "Jean Dupont",
  "poste": "Senior Dev",
  "email": "jean@test.com"
}
```

### Supprimer
```bash
DELETE /api/members/:id
# Headers: Authorization: Bearer TOKEN
```

## 📋 Tâches
### Lister
```bash
GET /api/tasks
```

### Créer
```bash
POST /api/tasks
# Headers: Authorization: Bearer TOKEN
{
  "titre": "Nouvelle tâche",
  "description": "Description détaillée",
  "assigne": "membre_id",
  "priorite": "haute",
  "statut": "a_faire",
  "dateEcheance": "2024-12-31"
}
```

### Modifier
```bash
PUT /api/tasks/:id
# Headers: Authorization: Bearer TOKEN
{
  "titre": "Tâche modifiée",
  "statut": "en_cours"
}
```

### Supprimer
```bash
DELETE /api/tasks/:id
# Headers: Authorization: Bearer TOKEN
