const { NtExecutable, NtExecutableResource, Resource } = require('resedit');
const fs = require('fs');
const path = require('path');

const EXE = path.join(__dirname, '..', 'bin', 'classicuo-ua-mcp.exe');
const exe = NtExecutable.from(fs.readFileSync(EXE), { ignoreCert: true });
const res = NtExecutableResource.from(exe);

const groups = Resource.IconGroupEntry.fromEntries(res.entries);
console.log('Grupos de iconos encontrados:');
groups.forEach(g => console.log(' ID:', g.id, '| Lang:', g.lang));
