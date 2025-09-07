const { exec } = require('child_process');

// Démarrer le serveur backend
const backend = exec('node index.js', {
  cwd: __dirname,
  env: process.env
});

backend.stdout.on('data', (data) => {
  console.log(`Backend: ${data}`);
});

backend.stderr.on('data', (data) => {
  console.error(`Backend Error: ${data}`);
});

backend.on('close', (code) => {
  console.log(`Backend process exited with code ${code}`);
});

// Démarrer le frontend
const frontend = exec('npm run dev', {
  cwd: `${__dirname}/task-manager`,
  env: process.env
});

frontend.stdout.on('data', (data) => {
  console.log(`Frontend: ${data}`);
});

frontend.stderr.on('data', (data) => {
  console.error(`Frontend Error: ${data}`);
});

frontend.on('close', (code) => {
  console.log(`Frontend process exited with code ${code}`);
});

// Gérer la fermeture du processus
process.on('SIGINT', () => {
  console.log('Arrêt des serveurs...');
  backend.kill();
  frontend.kill();
  process.exit();
});
