const { spawn } = require('child_process');
const path = require('path');

const EXE = path.join(__dirname, '..', 'bin', 'classicuo-ua-mcp.exe');
const proc = spawn(EXE, [], { stdio: ['pipe', 'pipe', 'pipe'] });

proc.stderr.on('data', d => console.error('[stderr]', d.toString()));
proc.on('error', err => { console.error('Error al arrancar:', err.message); process.exit(1); });
proc.on('exit', code => console.log('Proceso terminó con código:', code));

let fullResponse = '';
proc.stdout.on('data', d => { fullResponse += d.toString(); });

const send = msg => proc.stdin.write(JSON.stringify(msg) + '\n');

// 1. Handshake
setTimeout(() => {
  send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1.0' } } });
}, 200);

// 2. Listar recursos
setTimeout(() => {
  send({ jsonrpc: '2.0', id: 2, method: 'resources/list', params: {} });
}, 800);

// 3–6. Leer contenido de cada recurso
setTimeout(() => {
  send({ jsonrpc: '2.0', id: 3, method: 'resources/read', params: { uri: 'classicuo://api' } });
}, 1400);

setTimeout(() => {
  send({ jsonrpc: '2.0', id: 4, method: 'resources/read', params: { uri: 'classicuo://best-practices' } });
}, 2000);

setTimeout(() => {
  send({ jsonrpc: '2.0', id: 5, method: 'resources/read', params: { uri: 'classicuo://ua-commands' } });
}, 2600);

setTimeout(() => {
  send({ jsonrpc: '2.0', id: 6, method: 'resources/read', params: { uri: 'classicuo://ua-examples' } });
}, 3200);

setTimeout(() => {
  send({ jsonrpc: '2.0', id: 7, method: 'resources/read', params: { uri: 'classicuo://ua-npcs' } });
}, 3800);

setTimeout(() => {
  send({ jsonrpc: '2.0', id: 8, method: 'resources/read', params: { uri: 'classicuo://ua-crafting-items' } });
}, 4400);

setTimeout(() => {
  send({ jsonrpc: '2.0', id: 9, method: 'resources/read', params: { uri: 'classicuo://ua-colors' } });
}, 5000);

// 10. Evaluar
setTimeout(() => {
  const checks = [
    // Handshake
    { text: 'classicuo-ua-mcp',                      desc: 'Servidor arranca y responde' },
    // URIs en la lista
    { text: 'classicuo://api',                        desc: 'URI api listada' },
    { text: 'classicuo://best-practices',             desc: 'URI best-practices listada' },
    { text: 'classicuo://ua-commands',                desc: 'URI ua-commands listada' },
    { text: 'classicuo://ua-examples',                desc: 'URI ua-examples listada' },
    { text: 'classicuo://ua-npcs',                    desc: 'URI ua-npcs listada' },
    { text: 'classicuo://ua-crafting-items',          desc: 'URI ua-crafting-items listada' },
    { text: 'classicuo://ua-colors',                  desc: 'URI ua-colors listada' },
    // Contenido embebido de cada recurso
    { text: 'variables globales',                     desc: 'Contenido de classicuo://api embebido' },
    { text: 'Intervalos de sleep recomendados',       desc: 'Contenido de classicuo://best-practices embebido' },
    { text: "player.say('.vendas')",                  desc: 'Contenido de classicuo://ua-commands embebido' },
    { text: 'Auto-curación con vendas',               desc: 'Contenido de classicuo://ua-examples embebido' },
    { text: 'Gallina',                                desc: 'Contenido de classicuo://ua-npcs embebido' },
    { text: 'ITEMS - HERRERIA',                       desc: 'Contenido de classicuo://ua-crafting-items embebido' },
    { text: 'color_o_valorite',                       desc: 'Contenido de classicuo://ua-colors embebido' },
    { text: 'color_dragones',                          desc: 'Slayers embebidos en classicuo://ua-colors' },
    { text: 'tub_b1',                                  desc: 'TUB embebidos en classicuo://ua-colors' },
  ];

  console.log('\n── Validación del .exe ──');
  let ok = true;
  checks.forEach(({ text, desc }) => {
    const pass = fullResponse.includes(text);
    console.log((pass ? '✓' : '✗') + ' ' + desc);
    if (!pass) ok = false;
  });

  console.log(`\n${ok ? 'OK' : 'FALLIDO'} — ${checks.filter(c => fullResponse.includes(c.text)).length}/${checks.length} checks`);
  proc.kill();
  process.exit(ok ? 0 : 1);
}, 7000);
