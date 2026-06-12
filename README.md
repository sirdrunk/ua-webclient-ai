# ua-webclient-ai

Herramientas IA para scripting de macros en el servidor **Ultima Alianza** — ClassicUO Web Client.

🌐 [ultima-alianza.com](https://ultima-alianza.com) · 💬 [Discord](https://discordapp.com/invite/RFwnP6d) · 📺 [YouTube](https://www.youtube.com/user/UASphereStaff) · 🐦 [Twitter](https://twitter.com/uasphere) · 🎮 [Twitch](https://www.twitch.tv/devpiruz)

## Qué es esto

Este repositorio contiene recursos para usar cualquier IA como asistente al escribir macros para el cliente web Classic de **Ultima Alianza**, el servidor de Ultima Online en español.

Los macros se escriben en TypeScript y se ejecutan directamente en Chrome. La API del cliente inyecta un conjunto de variables globales (`player`, `client`, `target`, `journal`...) que ninguna IA conoce por defecto. Este proyecto resuelve eso.

## Contenido

### `context-pack/`

Dos archivos markdown listos para pegar como contexto en cualquier IA (ChatGPT, Claude, Gemini, Copilot...).

#### `classicuo-scripting-context.md` — obligatorio

Toda la API de scripting de ClassicUO: variables globales, tipos, métodos, enumeraciones completas. La IA necesita este archivo para conocer la API y escribir macros correctamente.

#### `best-practices.md` — opcional pero recomendado

Guía de buenas prácticas para macros robustos y eficientes: cómo estructurar bucles, cuándo usar búsquedas de cliente vs comandos de servidor, cómo evitar que el macro consuma recursos del juego, y más. Pégalo junto al context pack para que la IA aplique estas prácticas automáticamente al generar código.

**Cómo usarlo:**

1. Abre `context-pack/classicuo-scripting-context.md`
2. Copia el contenido
3. Pégalo como primer mensaje o system prompt en tu IA favorita
4. Opcionalmente, añade también el contenido de `context-pack/best-practices.md` para obtener macros más robustos
5. A partir de ahí, la IA conoce la API completa y puede ayudarte a escribir macros correctamente

## Fuente de la documentación

La API está extraída de la documentación oficial de ClassicUO:

- Web: https://www.classicuo.org/scripting/
- GitHub: https://github.com/ClassicUO/classicuo-web/tree/main/site/scripting

Última actualización del context pack: **2026-06-12**

---

*Construido con IA, probado en batalla y hecho con amor por la comunidad de Ultima Alianza.*
