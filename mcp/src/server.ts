#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListResourcesRequestSchema, ReadResourceRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Los imports de markdown son resueltos por esbuild (--loader:.md=text) al compilar el .exe.
// En modo desarrollo (node dist/server.js), se usa readFileSync en runtime.
declare const __API_CONTENT__: string | undefined;
declare const __BEST_PRACTICES_CONTENT__: string | undefined;
declare const __UA_COMMANDS_CONTENT__: string | undefined;
declare const __UA_EXAMPLES_CONTENT__: string | undefined;
declare const __UA_NPCS_CONTENT__: string | undefined;
declare const __UA_CRAFTING_ITEMS_CONTENT__: string | undefined;
declare const __UA_COLORS_CONTENT__: string | undefined;

function loadResource(filename: string, embedded: string | undefined): string {
  if (embedded !== undefined) return embedded;
  return readFileSync(join(__dirname, '..', 'resources', filename), 'utf-8');
}

const RESOURCES = [
  {
    uri: 'classicuo://api',
    name: 'ClassicUO Web Client — API de scripting',
    description: 'Referencia completa de la API global: player, client, target, journal, Gump, enumeraciones y tipos. Necesario para escribir cualquier macro.',
    content: () => loadResource('classicuo-scripting-context.md', typeof __API_CONTENT__ !== 'undefined' ? __API_CONTENT__ : undefined),
  },
  {
    uri: 'classicuo://best-practices',
    name: 'ClassicUO Web Client — Buenas prácticas',
    description: 'Guía de patrones para macros robustos: bucles con sleep, estados bloqueantes, cliente vs servidor, timeouts, journal.clear, condiciones de salida.',
    content: () => loadResource('best-practices.md', typeof __BEST_PRACTICES_CONTENT__ !== 'undefined' ? __BEST_PRACTICES_CONTENT__ : undefined),
  },
  {
    uri: 'classicuo://ua-commands',
    name: 'Ultima Alianza — Comandos del servidor',
    description: 'Comandos específicos de UA: punto (.vendas, .cast N, .vida, .nigro N...) y voz (mascotas, NPCs, barcos, casas). Incluye tabla completa de hechizos por número.',
    content: () => loadResource('ua-commands.md', typeof __UA_COMMANDS_CONTENT__ !== 'undefined' ? __UA_COMMANDS_CONTENT__ : undefined),
  },
  {
    uri: 'classicuo://ua-examples',
    name: 'Ultima Alianza — Ejemplos de macros',
    description: '12 macros reales anotados de jugadores de UA. Cubren bucle de curación, detección de estado, avisos PvP, loot, entrenamiento de skill, domado y más.',
    content: () => loadResource('ua-examples.md', typeof __UA_EXAMPLES_CONTENT__ !== 'undefined' ? __UA_EXAMPLES_CONTENT__ : undefined),
  },
  {
    uri: 'classicuo://ua-npcs',
    name: 'Ultima Alianza — NPCs del servidor',
    description: '497 NPCs de UA con nombre, gráfico hex y decimal. Útil para macros de combat, taming o identificación de criaturas.',
    content: () => loadResource('ua-npcs.md', typeof __UA_NPCS_CONTENT__ !== 'undefined' ? __UA_NPCS_CONTENT__ : undefined),
  },
  {
    uri: 'classicuo://ua-crafting-items',
    name: 'Ultima Alianza — Items crafteables',
    description: 'Items crafteables de UA con gráfico hex: herrería, sastrería, carpintería, alquimia, arquería, inscripción, tinkering, pociones, reagentes y armaduras de escamas.',
    content: () => loadResource('ua-crafting-items.md', typeof __UA_CRAFTING_ITEMS_CONTENT__ !== 'undefined' ? __UA_CRAFTING_ITEMS_CONTENT__ : undefined),
  },
  {
    uri: 'classicuo://ua-colors',
    name: 'Ultima Alianza — Colores importantes',
    description: 'Hues de referencia para scripting: metales/ores (mismo hue para ore, lingote y armadura), armas slayer y tintes de temporada (tub).',
    content: () => loadResource('colores_importantes_ua.md', typeof __UA_COLORS_CONTENT__ !== 'undefined' ? __UA_COLORS_CONTENT__ : undefined),
  },
];

const server = new Server(
  { name: 'classicuo-ua-mcp', version: '1.2.0' },
  { capabilities: { resources: {} } }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: RESOURCES.map(({ uri, name, description }) => ({ uri, name, description, mimeType: 'text/markdown' })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resource = RESOURCES.find((r) => r.uri === request.params.uri);
  if (!resource) throw new Error(`Recurso no encontrado: ${request.params.uri}`);
  return {
    contents: [{ uri: resource.uri, mimeType: 'text/markdown', text: resource.content() }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  process.stderr.write(`Error arrancando el servidor MCP: ${err}\n`);
  process.exit(1);
});
