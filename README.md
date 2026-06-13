# ua-webclient-ai

Herramientas IA para scripting de macros en el servidor **Ultima Alianza** — ClassicUO Web Client.

🌐 [ultima-alianza.com](https://ultima-alianza.com) · 💬 [Discord](https://discordapp.com/invite/RFwnP6d) · 📺 [YouTube](https://www.youtube.com/user/UASphereStaff) · 🐦 [Twitter](https://twitter.com/uasphere) · 🎮 [Twitch](https://www.twitch.tv/devpiruz)

## Qué es esto

Este repositorio contiene recursos para usar cualquier IA como asistente al escribir macros para el cliente web Classic de **Ultima Alianza**, el servidor de Ultima Online en español.

Los macros se escriben en TypeScript y se ejecutan directamente en Chrome. La API del cliente inyecta un conjunto de variables globales (`player`, `client`, `target`, `journal`...) que ninguna IA conoce por defecto. Este proyecto resuelve eso.

## Contenido

### `context-pack/`

Archivos markdown listos para pegar como contexto en cualquier IA (ChatGPT, Claude, Gemini, Copilot...).

#### `classicuo-scripting-context.md` — obligatorio

Toda la API de scripting de ClassicUO: variables globales, tipos, métodos, enumeraciones completas. La IA necesita este archivo para conocer la API y escribir macros correctamente.

#### `best-practices.md` — opcional pero recomendado

Guía de buenas prácticas para macros robustos y eficientes: cómo estructurar bucles, cuándo usar búsquedas de cliente vs comandos de servidor, cómo evitar que el macro consuma recursos del juego, y más. Pégalo junto al context pack para que la IA aplique estas prácticas automáticamente al generar código.

### `context-pack/ua/` — específico de Ultima Alianza

Recursos adicionales exclusivos del servidor Ultima Alianza. Combínalos con los archivos anteriores para que la IA conozca los comandos y patrones propios de UA.

#### `ua/ua-commands.md`

Referencia completa de comandos del servidor UA: comandos de punto (`.vendas`, `.cast N`, `.vida`, `.nigro N`...), comandos de voz (mascotas, NPCs, barcos, casas) y la distinción entre ambos tipos. Incluye todos los hechizos de mago, nigromante, bardo y paladín con su número de comando.

#### `ua/ua-examples.md`

12 macros reales anotados de jugadores de UA y la comunidad ClassicUO. Cubren los patrones más comunes: bucle de curación, detección de estado, avisos PvP, loot, montura, escape, entrenamiento de skill, domado de animales. Los antipatrones presentes están marcados con comentarios para que la IA los evite al generar código nuevo.

**Cómo usarlo:**

1. Abre `context-pack/classicuo-scripting-context.md`
2. Copia el contenido
3. Pégalo como primer mensaje o system prompt en tu IA favorita
4. Opcionalmente, añade `context-pack/best-practices.md` para obtener macros más robustos
5. Si juegas en Ultima Alianza, añade también `context-pack/ua/ua-commands.md` y `context-pack/ua/ua-examples.md`
6. A partir de ahí, la IA conoce la API completa y los comandos de UA y puede ayudarte a escribir macros correctamente

## MCP Server — integración automática

<p align="center">
  <img src="mcp/mcp_IA_UA.png" alt="ClassicUO UA MCP" width="180"/>
</p>

En lugar de copiar y pegar los archivos manualmente, el **MCP server** los inyecta automáticamente en cualquier cliente IA compatible: Claude Desktop, Cursor, Windsurf, Continue...

La IA tendrá disponibles los 4 recursos en cuanto arranque la sesión, sin que el usuario tenga que hacer nada más.

### Instalación

#### Opción A — Ejecutable (sin Node.js)

Descarga `classicuo-ua-mcp.exe` desde la sección [Releases](https://github.com/sirdrunk/ua-webclient-ai/releases) y ponlo en una carpeta permanente (por ejemplo `C:\UA\mcp\`).

No requiere instalar Node.js ni ninguna dependencia.

#### Opción B — npx (requiere Node.js)

```
npx classicuo-ua-mcp
```

### Configuración

#### Claude Desktop

Edita `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "classicuo-ua": {
      "command": "C:/UA/mcp/classicuo-ua-mcp.exe"
    }
  }
}
```

Con npx:

```json
{
  "mcpServers": {
    "classicuo-ua": {
      "command": "npx",
      "args": ["classicuo-ua-mcp"]
    }
  }
}
```

#### Cursor

Edita `%APPDATA%\Cursor\User\globalStorage\roamingSettings.json` o ve a *Settings → MCP*:

```json
{
  "mcpServers": {
    "classicuo-ua": {
      "command": "C:/UA/mcp/classicuo-ua-mcp.exe"
    }
  }
}
```

Con npx:

```json
{
  "mcpServers": {
    "classicuo-ua": {
      "command": "npx",
      "args": ["classicuo-ua-mcp"]
    }
  }
}
```

#### Windsurf

Edita `%APPDATA%\Windsurf\User\globalStorage\roamingSettings.json` o ve a *Settings → MCP*:

```json
{
  "mcpServers": {
    "classicuo-ua": {
      "command": "C:/UA/mcp/classicuo-ua-mcp.exe"
    }
  }
}
```

Con npx:

```json
{
  "mcpServers": {
    "classicuo-ua": {
      "command": "npx",
      "args": ["classicuo-ua-mcp"]
    }
  }
}
```

> Para el `.exe`: cambia `C:/UA/mcp/classicuo-ua-mcp.exe` por la ruta donde hayas guardado el ejecutable. Usa barras `/` en lugar de `\`.

### Recursos disponibles

Una vez configurado, el servidor expone estos recursos que la IA puede consultar automáticamente:

| URI | Contenido |
|-----|-----------|
| `classicuo://api` | API completa de scripting de ClassicUO |
| `classicuo://best-practices` | Guía de buenas prácticas para macros robustos |
| `classicuo://ua-commands` | Comandos del servidor Ultima Alianza |
| `classicuo://ua-examples` | 12 macros reales anotados de jugadores de UA |

---

## Fuente de la documentación

La API está extraída de la documentación oficial de ClassicUO:

- Web: https://www.classicuo.org/scripting/
- GitHub: https://github.com/ClassicUO/classicuo-web/tree/main/site/scripting

Última actualización del context pack: **2026-06-12**

---

*Construido con IA, probado en batalla y hecho con amor por la comunidad de Ultima Alianza.*
