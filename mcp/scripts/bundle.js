const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const resourcesDir = path.join(__dirname, '..', 'resources');

const define = {
  __API_CONTENT__:           JSON.stringify(fs.readFileSync(path.join(resourcesDir, 'classicuo-scripting-context.md'), 'utf-8')),
  __BEST_PRACTICES_CONTENT__: JSON.stringify(fs.readFileSync(path.join(resourcesDir, 'best-practices.md'), 'utf-8')),
  __UA_COMMANDS_CONTENT__:   JSON.stringify(fs.readFileSync(path.join(resourcesDir, 'ua-commands.md'), 'utf-8')),
  __UA_EXAMPLES_CONTENT__:   JSON.stringify(fs.readFileSync(path.join(resourcesDir, 'ua-examples.md'), 'utf-8')),
};

esbuild.buildSync({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/bundle.js',
  define,
});

console.log('Bundle creado: dist/bundle.js');
