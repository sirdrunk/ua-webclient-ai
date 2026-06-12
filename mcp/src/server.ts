#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const RESOURCES_DIR = join(__dirname, '..', 'resources');

const RESOURCES = [
  {
    uri: 'classicuo://api',
    name: 'ClassicUO Web Client — API de scripting',
    description: 'Referencia completa de la API global: player, client, target, journal, Gump, enumeraciones y tipos. Necesario para escribir cualquier macro.',
    file: 'classicuo-scripting-context.md',
  },
  {
    uri: 'classicuo://best-practices',
    name: 'ClassicUO Web Client — Buenas prácticas',
    description: 'Guía de patrones para macros robustos: bucles con sleep, estados bloqueantes, cliente vs servidor, timeouts, journal.clear, condiciones de salida.',
    file: 'best-practices.md',
  },
  {
    uri: 'classicuo://ua-commands',
    name: 'Ultima Alianza — Comandos del servidor',
    description: 'Comandos específicos de UA: punto (.vendas, .cast N, .vida, .nigro N...) y voz (mascotas, NPCs, barcos, casas). Incluye tabla completa de hechizos por número.',
    file: 'ua-commands.md',
  },
  {
    uri: 'classicuo://ua-examples',
    name: 'Ultima Alianza — Ejemplos de macros',
    description: '12 macros reales anotados de jugadores de UA. Cubren bucle de curación, detección de estado, avisos PvP, loot, entrenamiento de skill, domado y más.',
    file: 'ua-examples.md',
  },
];

const server = new Server(
  { name: 'classicuo-ua-mcp', version: '1.0.0' },
  { capabilities: { resources: {} } }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: RESOURCES.map(({ uri, name, description }) => ({
    uri,
    name,
    description,
    mimeType: 'text/markdown',
  })),
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const resource = RESOURCES.find((r) => r.uri === request.params.uri);

  if (!resource) {
    throw new Error(`Recurso no encontrado: ${request.params.uri}`);
  }

  const content = readFileSync(join(RESOURCES_DIR, resource.file), 'utf-8');

  return {
    contents: [
      {
        uri: resource.uri,
        mimeType: 'text/markdown',
        text: content,
      },
    ],
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
