# ClassicUO Web Client — Scripting Best Practices

Fuente: experiencia operacional en Ultima Alianza + documentacion oficial ClassicUO Web Client.
Fecha: 2026-06-12

---

## Contexto de ejecucion

Los macros corren dentro del mismo proceso de Chrome que el propio cliente del juego. No hay separacion de hilos. Si un macro consume CPU de forma agresiva, Chrome lo prioriza sobre el renderizado del juego, produciendo lag visible, caidas de FPS y deterioro de la experiencia de juego. Esto afecta solo al jugador que ejecuta el macro, pero en escenarios PvP puede ser determinante.

---

## 1. Siempre incluir sleep en la rama inactiva de un bucle

Un `while(true)` sin `sleep` en la rama donde no hay trabajo ejecuta miles de iteraciones por segundo. Chrome dedica ciclos de CPU al script en lugar de al renderizado del juego.

```ts
// MAL: cuando hits == maxHits el bucle gira sin hacer nada
while (true) {
  if (player.hits < player.maxHits) {
    // logica de curacion
  }
}

// BIEN: cuando no hay trabajo, ceder el control
while (true) {
  if (player.hits < player.maxHits) {
    // logica de curacion
  } else {
    sleep(500);
  }
}
```

Valor recomendado para la rama inactiva: entre 200ms y 500ms. Valores menores no aportan reactividad perceptible pero si incrementan la carga.

---

## 2. Comprobar estados bloqueantes antes de ejecutar logica

Hay estados del personaje en los que ninguna accion de combate o curacion tiene efecto: paralisis, muerte, o estados similares. Ejecutar la logica de curacion mientras el personaje esta paralizado genera llamadas a la API y potencialmente paquetes al servidor sin ningun resultado util.

Comprobar los estados al inicio del ciclo y saltar directamente al `sleep` si no es posible actuar:

```ts
while (true) {
  if (player.isDead || player.isParalyzed) {
    sleep(500);
    continue;
  }

  if (player.hits < player.maxHits) {
    // logica de curacion
  } else {
    sleep(500);
  }
}
```

Estados a considerar segun el tipo de macro:

| Estado | Propiedad | Bloquea |
|--------|-----------|---------|
| Muerto | `player.isDead` | Todo |
| Paralizado | `player.isParalyzed` | Movimiento, uso de items, hechizos |
| Envenenado | `player.isPoisoned` | No bloquea, pero puede cambiar la prioridad de accion |
| Invulnerable | `player.isYellowHits` | No bloquea, pero curar puede ser innecesario |

---

## 3. Buscar items en la mochila, no en el mundo

`client.findType` sin `sourceSerial` busca en todos los objetos visibles en pantalla: el suelo, los contenedores abiertos, otros jugadores cercanos. Es una operacion mas costosa y puede devolver items que no son del jugador.

Acotar siempre la busqueda al contenedor correcto:

```ts
// MAL: busca en todo lo visible en pantalla
const bandage = client.findType(0xe21);

// BIEN: busca solo en la mochila del jugador
const bandage = client.findType(0xe21, null, player.backpack);
```

Adicionalmente, `range: 0` limita la busqueda al contenedor directo sin entrar en sub-bolsas:

```ts
const bandage = client.findType(0xe21, null, player.backpack, null, 0);
```

---

## 4. Comandos de servidor vs busquedas de cliente

Hay dos formas de localizar y usar un item. La eleccion tiene consecuencias directas en la dependencia del lag del servidor.

### Comando de servidor

```ts
player.say('.vendas');
target.wait();
target.self();
```

- El servidor busca la venda, gestiona el uso y devuelve el control a la macro.
- Si hay lag de servidor, la macro espera. Un spike de latencia retrasa toda la secuencia.
- Mas simple de escribir.
- El servidor puede buscar el item en cualquier lugar del inventario.

### Busqueda de cliente

```ts
const bandage = client.findType(0xe21, null, player.backpack);
if (bandage) {
  player.use(bandage);
  target.waitTargetSelf();
}
```

- La busqueda del item es local: Chrome busca en su propio estado del juego sin consultar al servidor.
- Solo se genera trafico de red en el momento de usar el item, no en la busqueda.
- Menos dependencia del lag para la fase de localizacion.
- Mas compleja de escribir.
- Requiere que los items esten en una ubicacion conocida y predecible (la mochila principal, no sub-bolsas variables).

**Criterio de eleccion:** para macros de combate o situaciones donde el lag es un factor critico, preferir busqueda de cliente. Para macros de craft o automatizacion tranquila, el comando de servidor es suficiente y mas simple.

---

## 5. Usar serial vs graphic segun el caso de uso

Un **serial** identifica un objeto especifico e irrepetible. Si ese objeto se destruye, el serial queda invalido y la macro falla silenciosamente o lanza errores.

Un **graphic** identifica un tipo de objeto. `client.findType(graphic)` siempre encontrara cualquier objeto de ese tipo que este disponible.

```ts
// MAL para vendas: si esa venda especifica se usa, el serial deja de existir
const BANDAGE_SERIAL = 0x4001abcd;
player.use(BANDAGE_SERIAL);

// BIEN: busca cualquier venda disponible
const bandage = client.findType(0xe21, null, player.backpack);
if (!bandage) { exit('Sin vendas'); }
player.use(bandage);
```

Usar serial fijo solo cuando el objeto es permanente y unico: un runebook, una mochila especifica, un objeto del entorno fijo.

---

## 6. Siempre pasar timeout a las esperas

`journal.waitForText`, `target.wait` y metodos similares sin timeout esperan indefinidamente si el servidor no responde. En situaciones de lag o desconexion, la macro queda bloqueada sin posibilidad de recuperarse.

```ts
// MAL: si el servidor no responde, la macro se cuelga para siempre
journal.waitForText('intentando curarse');

// BIEN: timeout explicito, la macro puede reaccionar al fallo
const ok = journal.waitForText('intentando curarse', undefined, 3000);
if (!ok) {
  sleep(2000); // esperar antes de reintentar
  continue;
}
```

---

## 7. Limpiar el journal antes de esperar una respuesta

El journal acumula todos los mensajes recibidos desde que se inicio la macro. Sin `journal.clear()` previo, un `waitForText` puede detectar un mensaje antiguo que ya no es relevante y continuar con logica incorrecta.

```ts
// MAL: puede coincidir con un mensaje anterior de la misma sesion
player.say('.vendas');
target.wait();
target.self();
const ok = journal.waitForText('intentando curarse', undefined, 3000);

// BIEN: limpiar justo antes de la accion que genera la respuesta esperada
player.say('.vendas');
target.wait();
target.self();
journal.clear();
const ok = journal.waitForText('intentando curarse', undefined, 3000);
```

---

## 8. No llamar queryItemOPL en bucle

`client.queryItemOPL` consulta las propiedades de un item al servidor (Object Property List). Cada llamada genera trafico de red. Llamarla dentro de un bucle sobre una lista de items puede generar una rafaga de paquetes significativa.

```ts
// MAL: una peticion de red por cada item en cada iteracion del bucle
while (true) {
  const items = client.findAllItemsOfType(0x1bf5, null, player.backpack);
  for (const item of items) {
    const opl = client.queryItemOPL(item); // peticion de red en bucle
    // ...
  }
  sleep(500);
}

// BIEN: llamar queryItemOPL solo cuando sea necesario y fuera del ciclo rapido
```

---

## 9. Intervalos de sleep recomendados segun el tipo de operacion

No todas las operaciones tienen el mismo coste. Leer propiedades locales del jugador no genera trafico de red; enviar comandos al servidor si lo hace. El intervalo de sleep debe ajustarse en consecuencia.

### Operaciones solo de cliente (sin trafico de red)

Leer `player.hits`, `player.stamina`, `player.mana`, `player.weight`, `player.isPoisoned` y similares son accesos a variables locales del cliente. No generan ningun paquete al servidor.

Lo mismo aplica a `client.findType()`, `client.findObject()` y cualquier busqueda de items — son busquedas sobre el estado local del cliente.

Para bucles que solo leen estado local, un intervalo de **200–500ms** es suficiente. Menos de 200ms no aporta reactividad perceptible y consume CPU innecesariamente.

```ts
// Monitorizar estamina: solo lectura local, 500ms es mas que suficiente
while (true) {
  if (player.stamina < player.maxStamina * 0.30) {
    // tomar pocion...
  }
  sleep(500);
}
```

### Operaciones que generan trafico al servidor

`player.say()`, `player.use()`, `player.useType()`, `player.cast()`, `player.moveItem()` y cualquier otro comando de accion envian paquetes al servidor. Ejecutarlos en un bucle sin control puede floodear la conexion.

Regla practica:
- Entre dos comandos consecutivos al servidor: minimo **500ms**, recomendado **1000ms**.
- Nunca reintentar una accion fallida sin sleep previo.
- Respetar los cooldowns del servidor (vendas, pociones, hechizos) usando journal para detectar el fin del cooldown en lugar de un tiempo fijo.

```ts
// MAL: reintenta usar la pocion cada 200ms si falla, floodeando el servidor
while (true) {
  if (player.stamina < player.maxStamina * 0.30) {
    player.say('.energia');
  }
  sleep(200);
}

// BIEN: usa la pocion una vez y espera confirmacion del servidor antes de reintentar
while (true) {
  if (player.stamina < player.maxStamina * 0.30 && !enCooldown) {
    player.say('.energia');
    enCooldown = true;
    journal.clear();
  }
  if (enCooldown && journal.waitForText('Ya puedes tomar pociones', undefined, 100)) {
    enCooldown = false;
    journal.clear();
  }
  sleep(500);
}
```

### Timeout en esperas de journal

`journal.waitForText` sin timeout espera indefinidamente. Si el servidor no envía el mensaje esperado — por lag, porque la acción falló, o porque el texto no coincide exactamente — la macro se queda bloqueada para siempre.

Siempre pasar un timeout acorde al tiempo razonable de respuesta del servidor:

- **Acciones rápidas** (pociones, usar item): 3000ms
- **Acciones con animación** (vendas, hechizos cortos): 5000–6000ms
- **Hechizos largos o acciones lentas**: 8000–10000ms

```ts
// MAL: si el servidor no responde, la macro se cuelga indefinidamente
journal.waitForText('Ya puedes tomar pociones de nuevo');

// BIEN: timeout de 3 segundos para una pocion
const respondio = journal.waitForText('Ya puedes tomar pociones de nuevo', undefined, 3000);
if (!respondio) {
  // el servidor no confirmo — asumir cooldown expirado o accion fallida
  enCooldown = false;
  journal.clear();
}
```

### Tabla de referencia rapida

| Tipo de operacion | Trafico de red | Intervalo recomendado |
|---|---|---|
| Leer stats (`player.hits`, `player.stamina`...) | No | 200–500ms |
| Buscar items (`client.findType`) | No | 200–500ms |
| Leer journal (`journal.containsText`) | No | 200–500ms |
| Esperar mensaje de servidor (`journal.waitForText`) | No | timeout 3000–8000ms según acción |
| Usar item / dar comando (`player.say`, `player.use`) | Si | 1 vez por cooldown del servidor |
| Lanzar hechizo (`player.cast`) | Si | 1 vez por casting time |
| Mover items (`player.moveItem`) | Si | 500ms minimo entre movimientos |

---

## 10. Incluir siempre una condicion de salida

Una macro sin condicion de salida ante recursos agotados entra en un bucle infinito intentando una accion imposible, generando carga innecesaria en el cliente y potencialmente en el servidor.

```ts
// MAL: si no hay vendas, el bucle sigue girando intentando curar
while (true) {
  if (player.hits < player.maxHits) {
    player.useType(0xe21);
    target.waitTargetSelf();
  } else {
    sleep(500);
  }
}

// BIEN: verificar disponibilidad de recursos y salir o notificar
while (true) {
  if (player.hits < player.maxHits) {
    const bandage = client.findType(0xe21, null, player.backpack);
    if (!bandage) {
      client.sysMsg('Sin vendas. Macro detenida.');
      exit('Sin vendas');
    }
    player.use(bandage);
    target.waitTargetSelf();
  } else {
    sleep(500);
  }
}
```
