# Instructions pour Démarrer l'Application

## 1. Créer le fichier .env

Dans le dossier `c:\Users\Aissatou\Desktop\gestionpProjet\`, créez un fichier nommé `.env` avec ce contenu :

```
MONGO_URI=mongodb+srv://aissatou224:aissatou224@cluster0.t5dzavx.mongodb.net/Taches?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
JWT_SECRET=mon-secret-jwt-2024
```

## 2. Démarrer le Backend

```bash
cd c:\Users\Aissatou\Desktop\gestionpProjet
node index.js
```

Vous devriez voir :
```
✅ Connexion MongoDB réussie
🚀 Serveur démarré sur http://localhost:5000
```

## 3. Vérifier le Backend

Ouvrez http://localhost:5000/api/test dans votre navigateur.

## 4. Frontend

Le frontend est déjà actif sur http://localhost:5173

## 5. Tester l'Application

- Inscription/Connexion : http://localhost:5173/register ou /login
- Gestion des tâches : http://localhost:5173/tasks
- Profil utilisateur : http://localhost:5173/profile

## Configuration Actuelle

- **Backend** : Port 5000 (MongoDB Atlas)
- **Frontend** : Port 5173 (Vite)
- **Base de données** : MongoDB Atlas (Cluster0/Taches)
- **Authentification** : JWT avec localStorage

Tous les ports et configurations sont corrects. Le seul fichier manquant est le `.env`.
