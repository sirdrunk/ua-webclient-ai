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

## 10. No iterar findType sobre un array de graficos

Cada llamada a `client.findType` sin `sourceSerial` hace un scan completo de todos los objetos visibles en pantalla: suelo, contenedores abiertos, jugadores cercanos. Si se itera sobre un array de graficos llamando `findType` por cada uno, se realizan N scans completos por iteracion. En zonas concurridas o con mucho loot en el suelo, esto genera lag de cliente visible.

```ts
// MAL: un scan completo del mundo por cada grafico en la lista
const lootList = [0x13C7, 0x13D3, 0xF3F, 0x1B72, 0x1B74];
while (true) {
  for (const graphic of lootList) {
    const item = client.findType(graphic); // scan completo de todo lo visible, cada vez
    if (item) {
      player.moveItem(item, player.backpack);
      sleep(600);
    }
  }
  sleep(300);
}
```

En su lugar, acotar siempre la busqueda a un contenedor concreto (`sourceSerial`). Si hay que buscar multiples tipos, usar `findAllItemsOfType` para cada uno o reducir la frecuencia del bucle:

```ts
// BIEN: busqueda acotada al cadaver o a la mochila, no al mundo
const lootList = [0x13C7, 0x13D3, 0xF3F, 0x1B72, 0x1B74];
while (true) {
  const cadaver = client.findType(0x2006); // buscar cadaver una sola vez por iteracion
  if (cadaver) {
    for (const graphic of lootList) {
      const item = client.findType(graphic, null, cadaver); // acotado al cadaver
      if (item) {
        player.moveItem(item, player.backpack);
        sleep(600);
      }
    }
  }
  sleep(500);
}
```

Si no hay forma de acotar la busqueda a un contenedor — por ejemplo, macros de PvP que eliminan items tirados en el suelo para desbloquear el paso durante una persecucion — el scan frecuente es intencionado y necesario. Aumentar el sleep destruiria la utilidad de la macro. En ese caso, el objetivo es minimizar el coste de cada scan en lugar de reducir la frecuencia:

**1. Limitar el rango de busqueda** con el parametro `range`. Solo importan los items en los 2–3 tiles inmediatos alrededor del jugador:

```ts
const RANGE = 2; // solo los tiles inmediatamente alrededor del jugador
while (true) {
  for (const graphic of bloqueadores) {
    // range=2 escanea solo los objetos mas proximos, no toda la pantalla
    const item = client.findType(graphic, null, null, null, RANGE);
    if (item) {
      player.moveItem(item, player.backpack);
      sleep(300);
    }
  }
  sleep(100);
}
```

**2. Buscar solo los graficos concretos** de los items usados como muro. No buscar todos los items del suelo, sino unicamente los tipos especificos que se usan como bloqueadores (muebles, objetos grandes).

**3. Usar `ignoreList`** para no reprocesar items que ya se intentaron mover y fallaron:

```ts
while (true) {
  for (const graphic of bloqueadores) {
    const item = client.findType(graphic, null, null, null, RANGE);
    if (item) {
      const moved = player.moveItem(item, player.backpack);
      if (!moved) ignoreList.add(item.serial); // no reintentar este item
      sleep(300);
    }
  }
  sleep(100);
}
```

**4. Filtrar por direccion del jugador.** Los items bloqueantes se tiran delante de quien huye, no detras. Escanear solo el semicirculo frontal usando `player.direction` y las coordenadas del item reduce a la mitad los items a procesar:

```ts
function estaEnFrente(item: Item): boolean {
  const dx = item.x - player.x;
  const dy = item.y - player.y;
  switch (player.direction) {
    case Directions.North: return dy <= 0;
    case Directions.South: return dy >= 0;
    case Directions.East:  return dx >= 0;
    case Directions.West:  return dx <= 0;
    case Directions.Right: return dx >= 0 && dy <= 0; // NE
    case Directions.Down:  return dx >= 0 && dy >= 0; // SE
    case Directions.Left:  return dx <= 0 && dy >= 0; // SW
    case Directions.Up:    return dx <= 0 && dy <= 0; // NW
    default: return true;
  }
}
```

**5. Activar por pulso de tecla en lugar de bucle continuo.** El patron mas eficiente para macros de combate intensivo es no usar `while(true)` permanente sino activar la macro con una tecla que ejecuta el scan durante un tiempo limitado y luego termina. Carga cero cuando no hay combate, reaccion maxima cuando se necesita:

```ts
// Macro asignada a una tecla — se ejecuta una vez por pulsacion
// Escanea y limpia el area durante 1 segundo, luego termina
const DURACION_MS = 1000;
const inicio = Date.now();

while (Date.now() - inicio < DURACION_MS) {
  for (const graphic of bloqueadores) {
    const items = client.findAllItemsOfType(graphic, null, null, null, RANGE);
    for (const item of items.filter(estaEnFrente)) {
      player.moveItem(item, player.backpack);
      sleep(300);
    }
  }
  sleep(100);
}
// La macro termina sola — el jugador pulsa la tecla cada vez que necesita limpiar el paso
```

**Limitacion conocida de la API:** no existe un metodo para obtener todos los items en un radio sin especificar grafico. El patron optimo seria un unico scan (`findAllItemsInRange`) seguido de filtrado por grafico y direccion en JS, pero la API actual requiere una llamada por cada grafico de la lista. Con listas largas de tipos de muebles esto genera N scans por iteracion — coste inevitable con las herramientas disponibles.

---

## 11. Verificar el exito de una transferencia de items por peso

Las macros que mueven items al inventario (reponer pociones, recoger recursos de mineria, talar, recoger materiales de craft) no siempre pueden confirmar el exito por journal — el servidor no siempre emite un mensaje claro o el texto puede variar. Una forma fiable y sin trafico de red es comparar `player.weight` antes y despues de la operacion: si el peso aumento, los items llegaron; si no cambio, la operacion fallo.

```ts
const pesoAntes = player.weight;

// operacion de transferencia
player.say('.reponerpociones'); // o moveItem, o cualquier accion que añada items
sleep(1000); // dar tiempo al servidor para procesar y actualizar el inventario

const pesoDespues = player.weight;

if (pesoDespues > pesoAntes) {
  client.headMsg('Reposicion OK', player, 68); // verde
} else {
  client.headMsg('Fallo al reponer — revisar inventario', player, 38); // rojo
}
```

Este patron es aplicable a cualquier macro que añada items al inventario:

| Tipo de macro | Lo que se transfiere |
|---|---|
| Reponer pociones | Pociones de vida, mana, stamina |
| Mineria | Lingotes, minerales |
| Tala | Troncos, madera |
| Craft | Materiales recogidos de un contenedor |
| Loot | Items de un cadaver |

`player.weight` es una lectura local — no genera trafico de red — por lo que comparar antes y despues no tiene ningun coste adicional.

**Nota:** dar siempre un `sleep` suficiente entre la accion y la lectura del peso final. El servidor necesita tiempo para procesar la transferencia y actualizar el estado del cliente. Un minimo de 500ms para transferencias locales; 1000–1500ms si hay lag o si la accion depende del servidor.

---

## 13. Items con grafico compartido — distinguir variantes por hue

En UO muchos items comparten el mismo grafico (`graphic`) pero se diferencian por el color (`hue`). Los casos mas comunes en UA:

- **Pociones** — todas usan el grafico `0xF0E` (frasco). El hue identifica el tipo: 63 = Agilidad, 28 = Antidoto, 12 = Explosion, etc.
- **Armaduras de distintos metales** — un `i_platemail_chest` de hierro y uno de oro comparten grafico; el hue indica el material.
- **Armaduras de cuero/escamas** — igual: mismo grafico, hue distinto segun el tipo de cuero o escama.

### Buscar por grafico y hue especifico

Cuando el macro necesita un tipo concreto, pasar el hue como segundo argumento de `findType`:

```ts
// Solo pociones de Antidoto (hue 28)
const antidoto = client.findType(0xF0E, 28, player.backpack);

// Solo pociones de Curacion Mejorada (hue 21)
const curacion = client.findType(0xF0E, 21, player.backpack);
```

### Buscar cualquier variante del grafico

Pasar `null` como hue para encontrar el item independientemente del color:

```ts
// Cualquier pocion, sea del tipo que sea
const cualquierPocion = client.findType(0xF0E, null, player.backpack);
```

### Comprobar el hue de un item encontrado

Si el macro necesita reaccionar de forma distinta segun la variante, leer la propiedad `.hue` del item:

```ts
const item = client.findType(0xF0E, null, player.backpack);
if (item) {
  if (item.hue === 28) {
    client.headMsg('Es un antidoto', player, 68);
  } else if (item.hue === 21) {
    client.headMsg('Es una pocion de curacion', player, 68);
  } else {
    client.headMsg('Pocion desconocida, hue: ' + item.hue, player, 53);
  }
}
```

Este mismo patron aplica a armaduras: encontrar una pieza con `findType` y comprobar `.hue` para saber si es de hierro, oro, escamas de dragon, etc., antes de equiparla o descartarla.

---

## 12. Incluir siempre una condicion de salida

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
