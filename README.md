# ua-webclient-ai

Herramientas IA para scripting de macros en el servidor **Ultima Alianza** — ClassicUO Web Client.

🌐 [ultima-alianza.com](https://ultima-alianza.com) · 💬 [Discord](https://discordapp.com/invite/RFwnP6d) · 📺 [YouTube](https://www.youtube.com/user/UASphereStaff) · 🐦 [Twitter](https://twitter.com/uasphere) · 🎮 [Twitch](https://www.twitch.tv/devpiruz)

## Qué es esto

Este repositorio contiene recursos para usar cualquier IA como asistente al escribir macros para el cliente web Classic de **Ultima Alianza**, el servidor de Ultima Online en español.

Los macros se escriben en TypeScript y se ejecutan directamente en Chrome. La API del cliente inyecta un conjunto de variables globales (`player`, `client`, `target`, `journal`...) que ninguna IA conoce por defecto. Este proyecto resuelve eso.

## Contenido

### `context-pack/`

Un archivo markdown con toda la API de scripting de ClassicUO condensada y lista para pegar como contexto en cualquier IA (ChatGPT, Claude, Gemini, Copilot...).

**Cómo usarlo:**

1. Abre `context-pack/classicuo-scripting-context.md`
2. Copia el contenido
3. Pégalo como primer mensaje o system prompt en tu IA favorita
4. A partir de ahí, la IA conoce la API completa y puede ayudarte a escribir macros correctamente

## Fuente de la documentación

La API está extraída de la documentación oficial de ClassicUO:

- Web: https://www.classicuo.org/scripting/
- GitHub: https://github.com/ClassicUO/classicuo-web/tree/main/site/scripting

Última actualización del context pack: **2026-06-12**

---

*Construido con IA, probado en batalla y hecho con amor por la comunidad de Ultima Alianza.*
