# Task Manager - Frontend React

Une application moderne de gestion de tâches construite avec React, Vite et TailwindCSS.

## 🚀 Technologies Utilisées

- **React 19** - Interface utilisateur
- **Vite** - Build tool et serveur de développement
- **TailwindCSS v3** - Framework CSS utilitaire
- **React Router** - Navigation
- **Axios** - Client HTTP
- **Vitest** - Tests unitaires

## 📁 Structure du Projet

```
task-manager/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── TaskList.jsx
│   │   ├── Task.jsx
│   │   └── TaskForm.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Tasks.jsx
│   │   └── About.jsx
│   ├── hooks/
│   │   └── useTasks.js
│   ├── utils/
│   │   └── localStorage.js
│   ├── styles/
│   │   └── tailwind.css
│   ├── tests/
│   │   ├── Task.test.jsx
│   │   ├── TaskList.test.jsx
│   │   └── TaskForm.test.jsx
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── README.md
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🛠️ Installation et Configuration

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Installer les dépendances manquantes**
   ```bash
   npm install react-router-dom axios tailwindcss postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Construire pour la production**
   ```bash
   npm run build
   ```

5. **Lancer les tests**
   ```bash
   npm run test
   ```

## 🔧 Configuration Backend

L'application frontend se connecte à l'API backend sur `http://localhost:3002/api`.

Assurez-vous que votre backend est démarré avant de lancer le frontend :

```bash
# Dans le répertoire racine du projet
node index.js
```

## 📋 Fonctionnalités

- ✅ **Gestion des tâches** - Créer, modifier, supprimer des tâches
- ✅ **Filtrage et tri** - Filtrer par statut, trier par différents critères
- ✅ **Priorités** - Définir des niveaux de priorité (faible, moyenne, haute)
- ✅ **Statuts** - Suivre l'avancement (à faire, en cours, terminé)
- ✅ **Échéances** - Définir des dates d'échéance
- ✅ **Interface responsive** - Optimisée pour mobile et desktop
- ✅ **Tests unitaires** - Couverture des composants principaux

## 🎨 Interface Utilisateur

L'application utilise TailwindCSS pour un design moderne et responsive :

- **Page d'accueil** - Présentation de l'application avec call-to-action
- **Page des tâches** - Interface principale de gestion avec statistiques
- **Page à propos** - Informations sur l'application et les technologies

## 🔗 API Endpoints

L'application communique avec les endpoints suivants :

- `GET /api/tasks` - Récupérer toutes les tâches
- `POST /api/tasks` - Créer une nouvelle tâche
- `PUT /api/tasks/:id` - Modifier une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche
- `GET /api/tasks/:id` - Récupérer une tâche spécifique

## 🧪 Tests

Les tests sont configurés avec Vitest et Testing Library :

```bash
# Lancer tous les tests
npm run test

# Lancer les tests en mode watch
npm run test -- --watch
```

## 📝 Notes de Développement

- Les erreurs TailwindCSS dans l'IDE sont normales et n'affectent pas le fonctionnement
- L'authentification est gérée via localStorage pour les tokens
- Les composants sont entièrement typés et documentés
- L'application est optimisée pour les performances avec React 19

## 🚀 Déploiement

Pour déployer l'application :

1. Construire le projet : `npm run build`
2. Le dossier `dist/` contient les fichiers statiques prêts pour le déploiement
3. Configurer votre serveur web pour servir les fichiers statiques
4. S'assurer que l'API backend est accessible depuis votre domaine de production

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
