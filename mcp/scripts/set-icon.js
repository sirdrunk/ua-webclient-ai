const pngToIco = require('png-to-ico').default;
const rcedit   = require('rcedit');
const path     = require('path');
const fs       = require('fs');
const os       = require('os');

const PNG      = path.join(__dirname, '..', 'mcp_IA_UA.png');
const ICO      = path.join(__dirname, '..', 'assets', 'icon.ico');
const BASE_BIN = path.join(os.homedir(), '.pkg-cache', 'v3.5', 'fetched-v20.20.2-win-x64');
const BASE_TMP = BASE_BIN + '.exe';

async function main() {
  // Generar ICO
  fs.mkdirSync(path.dirname(ICO), { recursive: true });
  const icoBuffer = await pngToIco(PNG);
  fs.writeFileSync(ICO, icoBuffer);
  console.log('Icono generado:', ICO);

  // rcedit necesita extensión .exe — copiar temporalmente
  fs.copyFileSync(BASE_BIN, BASE_TMP);

  try {
    await rcedit(BASE_TMP, { icon: ICO });
    console.log('Icono embebido en binario base');
    // Sobreescribir el binario base original con el modificado
    fs.copyFileSync(BASE_TMP, BASE_BIN);
    console.log('Binario base actualizado en caché');
  } finally {
    fs.unlinkSync(BASE_TMP);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
