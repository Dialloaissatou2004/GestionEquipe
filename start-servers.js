const { spawn } = require('child_process');
const path = require('path');

// Démarrer le serveur backend
const backend = spawn('node', ['index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
  },
});

// Démarrer le frontend après un court délai
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'task-manager'),
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  });
}, 2000);

// Gérer la fermeture du processus
process.on('SIGINT', () => {
  console.log('Arrêt des serveurs...');
  backend.kill();
  process.exit();
});
