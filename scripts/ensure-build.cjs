/**
 * Para deploy en servidores con poca RAM (Forge): si ya existe public/build
 * no ejecuta npm run build (evita OOM). Ejecutar en deploy: npm run build:if-missing
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'public', 'build', 'manifest.json');

if (fs.existsSync(manifestPath)) {
  console.log('Build exists (public/build), skipping npm run build.');
  process.exit(0);
}

console.log('No build found, running npm run build...');
execSync('npm run build', { stdio: 'inherit', shell: true, cwd: root });
