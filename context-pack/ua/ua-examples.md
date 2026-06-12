# Ultima Alianza — Ejemplos de macros

Colección de macros reales para el cliente web ClassicUO.
Fuente: jugadores de Ultima Alianza (CHEROKI, Warris) y comunidad ClassicUO (Shurre/UOALIVE).
Fecha: 2026-06-12

Convenciones de anotación usadas en este archivo:
- `// ATENCION:` — antipatrón presente en el código original, revisar antes de usar en producción.
- `// AJUSTAR:` — valor específico de servidor que debe adaptarse a Ultima Alianza.

---

## Índice

### Macros automáticas (bucle continuo)
1. [Auto-curación con vendas](#1-auto-curación-con-vendas) — CHEROKI / UA
2. [Auto-antiveneno](#2-auto-antiveneno) — CHEROKI / UA
3. [Aviso de vida](#3-aviso-de-vida) — CHEROKI / UA
4. [Aviso de poción y venda disponible](#4-aviso-de-poción-y-venda-disponible) — Warris / UA
5. [Monitor de peso](#5-monitor-de-peso) — Shurre / UOALIVE

### Macros manuales (one-shot, asignadas a tecla)
6. [Montar / desmontar montura](#6-montar--desmontar-montura) — CHEROKI / UA
7. [Runa de escape](#7-runa-de-escape) — CHEROKI / UA
8. [Caja trampa](#8-caja-trampa) — CHEROKI / UA
9. [Explosión PvP](#9-explosión-pvp) — CHEROKI / UA
10. [Auto-loot de cadáver](#10-auto-loot-de-cadáver) — Warris / UA

### Macros de entrenamiento de skill
11. [Entrenador de Magery](#11-entrenador-de-magery) — Shurre / UOALIVE
12. [Entrenador de Taming](#12-entrenador-de-taming) — Shurre / UOALIVE

---

## 1. Auto-curación con vendas

**Tipo:** automática | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Usa vendas automáticamente cuando la vida baja. Cuando hay suficientes vendas sucias acumuladas, las limpia sumergiéndolas en un contenedor de agua.
**Patrones:** bucle con journal, comando `.vendas` de UA, gestión de estado `canApplyBandages`, limpieza de items, `headMsg` sobre el jugador.

```js
/* 
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.3
*/

// Configuracion
const quantityDirtyBandages = 10; // numero de vendas sucias apiladas antes de ser limpiadas

// Informacion
const scriptName = 'Auto-Heal';
const version = '0.3';

client.sysMsg(`${scriptName} by CHEROKI`, 33);
client.sysMsg(`Version ${version}`, 66);

// Codigo
let canApplyBandages = true;
const dirtyBandagesType = 0xE20;
const waterContainerType = 0x1008;

journal.clear();

function healPlayer() {
  if (player.hits < player.maxHits && canApplyBandages) {
    player.say('.vendas');
    sleep(10);
    // ATENCION: target.wait() sin timeout — si el cursor no aparece, el macro se cuelga.
    target.wait();
    target.self();
    journal.clear();
    // ATENCION: waitForText sin timeout — si el servidor no responde, el macro se cuelga indefinidamente.
    if (journal.waitForText('No necesitas curarte', 'System') || journal.waitForText('pero fallas', 'System')) {
      canApplyBandages = true;
      journal.clear();
      return;
    }
    canApplyBandages = false;
    journal.clear();
  }

  // ATENCION: waitForText sin timeout — bloquea si el servidor no envía el mensaje.
  if (journal.waitForText('Ya puedes usar las vendas', 'System') && !canApplyBandages) {
    client.headMsg(`VENDAZO, VIDA ${player.hits}`, player, 66);
    canApplyBandages = true;
  }
}

function clearBandages() {
  // ATENCION: findType sin sourceSerial busca en toda la pantalla, no solo en la mochila.
  const dirtyBandages = client.findType(dirtyBandagesType);
  const waterContainer = client.findType(waterContainerType);

  if (dirtyBandages && dirtyBandages.amount > quantityDirtyBandages) {
    player.useType(dirtyBandagesType, undefined, player.backpack);
    target.wait();
    target.entity(waterContainer);
    sleep(200);
    player.moveItem(client.findType(0xE21), player.backpack);
  }
}

while (true) {
  healPlayer();
  clearBandages();
  sleep(100);
}
```

---

## 2. Auto-antiveneno

**Tipo:** automática | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Detecta cuando el personaje está envenenado y lanza el hechizo Cure automáticamente.
**Patrones:** detección de estado (`player.isPoisoned`), cast de hechizo + target a sí mismo en bucle.

```js
/*
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.1
*/

function checkPoison() {
  if (player.isPoisoned) {
    player.cast(Spells.Cure);
    target.wait();
    target.self();
    sleep(2000);
  }
}

// ATENCION: cuando el personaje NO está envenenado, el while gira sin sleep en la rama vacía.
// Añadir un else { sleep(500); } para evitar consumo innecesario de CPU.
while (true) {
  checkPoison();
}
```

---

## 3. Aviso de vida

**Tipo:** automática | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Muestra la vida actual encima del personaje cada vez que cambia. Verde si sube, rojo si baja.
**Patrones:** memoria de estado entre iteraciones (`oldHit`), `headMsg` con color condicional según dirección del cambio.

```js
/*
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.1
Description: Cada vez que la vida del pj cambia, se muestra un mensaje en la cabeza del pj
con el valor de vida actual y maxima, y el color cambia segun si la vida sube o baja.
*/

const scriptName = 'Aviso vida';
const version = 0.1;

client.sysMsg(`${scriptName} by CHEROKI`, 40);
client.sysMsg(`Version ${version}`, 66);

let oldHit = 0;

let COLOR_GREEN = 0x44;
let COLOR_YELLOW = 0x84e;
let COLOR_RED = 0x22;

function checkHits() {
  sleep(150);
  if (player.hits > oldHit) {
    client.headMsg(`HP ${player.hits}/${player.maxHits}`, player, COLOR_GREEN);
  } else if (player.hits < oldHit) {
    client.headMsg(`HP ${player.hits}/${player.maxHits}`, player, COLOR_RED);
  }

  oldHit = player.hits;
}

while (true) {
  checkHits();
}
```

---

## 4. Aviso de poción y venda disponible

**Tipo:** automática | **Autor:** Warris | **Servidor:** Ultima Alianza
**Descripción:** Escucha el journal y muestra un aviso encima del personaje cuando la poción o la venda están disponibles de nuevo. Requiere tener activados `.aviso_venda on` y `.aviso_pocion on` en el juego.
**Patrones:** `waitForTextAny` con array de textos, switch sobre el resultado para acción diferente por mensaje.

```js
// Macro by Warris Ahluwalia.
// Requiere: .aviso_venda on y .aviso_pocion on activados en el juego.

const avisoPocion = 'Ya puedes tomar pociones de nuevo!';
const avisoVenda = 'Ya puedes usar las vendas de nuevo!';

function checkDiario() {
  journal.clear();
  // ATENCION: waitForTextAny sin timeout — bloquea indefinidamente si el servidor
  // no envía ninguno de los dos mensajes (por ejemplo si los avisos están desactivados).
  const aviso = journal.waitForTextAny([avisoPocion, avisoVenda]);

  switch (aviso) {
    case avisoPocion: {
      client.headMsg('[POTI]', player.serial, 50);
      break;
    }
    case avisoVenda: {
      client.headMsg('[VENDA]', player.serial, 90);
      break;
    }
  }
}

while (true) {
  checkDiario();
}
```

---

## 5. Monitor de peso

**Tipo:** automática | **Autor:** Shurre | **Servidor:** UOALIVE (API compatible con UA)
**Descripción:** Muestra el peso actual encima del personaje cada vez que cambia, en color verde/amarillo/rojo según la proximidad al límite. También comprueba la durabilidad del equipo equipado periódicamente usando `queryItemOPL`.
**Patrones:** `player.weight` / `player.weightMax`, memoria de estado (`oldWeight`), `player.equippedItems`, `client.queryItemOPL` para leer propiedades de item.

```js
let yellowDifference = 100; // avisar en amarillo si faltan menos de X unidades para el límite
let redDifference = 20;     // avisar en rojo si faltan menos de X unidades para el límite
let oldWeight = 0;
let durabilityWarn = 20;          // umbral de durabilidad para avisar
let durabilityWarnFrequency = 50; // cada cuántas iteraciones comprobar durabilidad
let durabilityWarnCount = 0;

let COLOR_GREEN = 0x44;
let COLOR_YELLOW = 0x84E;
let COLOR_RED = 0x22;

while (true) {
  sleep(150);
  DurabilityTracker();
  if (oldWeight != player.weight) {
    if (player.weight > player.weightMax) {
      client.headMsg('[OVERWEIGHT]', player, COLOR_RED);
    }
    if (player.weightMax - player.weight <= redDifference) {
      let sb = '[' + player.weight + '/' + player.weightMax + ']';
      client.headMsg(sb, player, COLOR_RED);
      oldWeight = player.weight;
    }
    else if (player.weightMax - player.weight <= yellowDifference) {
      let sb = '[' + player.weight + '/' + player.weightMax + ']';
      client.headMsg(sb, player, COLOR_YELLOW);
      oldWeight = player.weight;
    }
    else {
      let sb = '[' + player.weight + '/' + player.weightMax + ']';
      client.headMsg(sb, player, COLOR_GREEN);
      oldWeight = player.weight;
    }
  }
}

function DurabilityTracker() {
  if (durabilityWarnCount > durabilityWarnFrequency) {
    let EQUIPPED_LIST = [
      player.equippedItems.gloves,
      player.equippedItems.necklace,
      player.equippedItems.helmet,
      player.equippedItems.arms,
      player.equippedItems.legs,
      player.equippedItems.torso,
      player.equippedItems.oneHanded,
      player.equippedItems.twoHanded
    ];

    for (let item of EQUIPPED_LIST) {
      try {
        // ATENCION: queryItemOPL genera tráfico de red por cada item en cada comprobación.
        // El parámetro durabilityWarnFrequency limita la frecuencia, pero es una llamada de red.
        let durability = ItemDurability(item.serial);
        if (durability < durabilityWarn) {
          let sb = item.name + ' now has a durability of ' + durability;
          client.headMsg(sb, 0, 0x22);
          durabilityWarnCount = 0;
        }
      }
      catch { }
    }
  }
  durabilityWarnCount++;
}

function ItemDurability(serial_item) {
  if (serial_item == 0) {
    return;
  }

  var tooltip = client.queryItemOPL(serial_item);
  const props = tooltip.data.split('\n');

  for (let i = 0; i < props.length; i++) {
    let value = null;
    var mod = props[i].match(/^\D+/)[0];
    mod = mod.toLowerCase().trim();
    var arr_value = props[i].match(/\d+/) ?? [].shift();

    if (arr_value != null) {
      value = arr_value.join();
    }
    switch (mod) {
      case 'durability': {
        return value;
      }
    }
  }
}
```

---

## 6. Montar / desmontar montura

**Tipo:** manual | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Itera sobre una lista de seriales de monturas y usa la primera que encuentre en el mundo. Si no encuentra ninguna, usa el serial del propio personaje para desmontar.
**Patrones:** `client.findObject` por serial, loop con break en primera coincidencia, lógica de fallback.

```js
/*
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.1
Description: El script se encarga de montar y desmontar las monturas que se le indiquen en la configuracion.
*/

// Configuracion
// AJUSTAR: añadir aquí el serial de cada montura que se quiera usar.
// Ejemplo: let pets = [0x0000001, 0x1111111];
let pets = [];

let foundObject;

for (let i = 0; i < pets.length; i++) {
  foundObject = client.findObject(pets[i]);
  if (foundObject) {
    player.use(foundObject);
    break;
  }
}

if (!foundObject) {
  player.use(player.serial);
}
```

---

## 7. Runa de escape

**Tipo:** manual | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Busca una runa de escape entre varios tipos posibles por orden de prioridad y lanza Recall sobre la primera que encuentre.
**Patrones:** array de tipos con prioridad, `findType` con break en primera coincidencia, cast + `target.entity` a un objeto encontrado.

```js
/*
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.1
*/

// Gráficos de los distintos tipos de runas.
const runeTypes = [0x1f14, 0x1f15, 0x1f16, 0x1f17];

function useRune() {
  let runeFound = null;

  for (let i = 0; i < runeTypes.length && runeFound === null; i++) {
    const rune = client.findType(runeTypes[i]);
    if (rune) {
      runeFound = rune;
      break;
    }
  }

  if (runeFound) {
    player.cast(Spells.Recall);
    target.wait();
    target.entity(runeFound);
  } else {
    client.sysMsg('No hay runa de escape');
  }
}

useRune();
```

---

## 8. Caja trampa

**Tipo:** manual | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Busca una caja trampa con hue específico y la activa con un clic doble.
**Patrones:** `findType` con hue específico como segundo parámetro, `player.click`.

```js
/*
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.1
*/

const cajaTrampaType = 0x9b0;

function useCajaTrampa() {
  // AJUSTAR: el segundo parámetro es el hue de la caja trampa. 0x21 es el valor de UA.
  const cajaTrampa = client.findType(cajaTrampaType, 0x21);

  if (cajaTrampa) {
    player.click(cajaTrampa);
  } else {
    client.sysMsg('No hay cajas trampa');
  }
}

useCajaTrampa();
```

---

## 9. Explosión PvP

**Tipo:** manual | **Autor:** CHEROKI | **Servidor:** Ultima Alianza
**Descripción:** Lanza el hechizo Explosion (43) desde el libro de magia y desde un pergamino en secuencia, apuntando al último objetivo seleccionado.
**Patrones:** comandos de servidor `.cast N` (libro) y `.pN` (pergamino), `target.lastSerial` para reutilizar el último objetivo.

```js
/*
Author: CHEROKI
Server: Ultima Alianza
Current Version: 0.1
*/

// .cast 43 = lanzar Explosion desde el libro de magia
// .p43 = lanzar Explosion desde un pergamino
player.say('.cast 43');
player.say('.p43');
target.wait();
target.entity(target.lastSerial);
```

---

## 10. Auto-loot de cadáver

**Tipo:** manual | **Autor:** Warris | **Servidor:** Ultima Alianza
**Descripción:** Abre el cadáver más cercano y transfiere a una bolsa de loot los items de una lista predefinida de gráficos.
**Patrones:** `findType` de cadáver (0x2006), `findType` con contenedor como fuente, `moveItem` con delay entre movimientos.

```js
// Macro by Warris Ahluwalia.

const cadaver = client.findType(0x2006);

// AJUSTAR: lista de gráficos de items que se quieren recoger del cadáver.
const lootList = [0x13C7, 0x13D3];

const bolsaLoot = client.findType(0xE76, null, player.backpack);

function openCorpse() {
  player.use(cadaver);
  sleep(500);
}

function autoLoot() {
  let found;
  for (let i = 0; i < lootList.length; i++) {
    found = client.findType(lootList[i], null, cadaver);
    if (found) {
      player.moveItem(found, bolsaLoot);
      sleep(600);
    }
  }
}

openCorpse();
autoLoot();
```

---

## 11. Entrenador de Magery

**Tipo:** automática | **Autor:** Shurre | **Servidor:** UOALIVE (API compatible con UA)
**Descripción:** Entrena Magery automáticamente seleccionando el hechizo adecuado según el nivel de skill. Medita cuando el mana es bajo. Para cuando se acaban los reactivos.
**Patrones:** `player.getSkill(Skills.X).value`, `player.useSkill(Skills.Meditation)`, `journal.containsText`, bucle de meditación anidado, condición de salida por recursos agotados.

```js
let shouldCast = true;
let meditateWhenMissing = 40; // meditar si faltan más de X puntos de mana
let spellRecoveryTime = 750;  // ms entre hechizos

enum JournalMageryMessages {
  ENTER = 'enter a meditative', // AJUSTAR: texto que emite UA al entrar en meditación
  FAIL = 'fail to enter',       // AJUSTAR: texto que emite UA al fallar meditación
  AT_PEACE = 'you are at peace',
  REGS_NEEDED = 'More reagents are needed' // AJUSTAR: texto que emite UA al quedarse sin reactivos
}

while (shouldCast) {
  let magery = (player.getSkill(Skills.Magery).value / 10);

  if ((player.maxMana - player.mana) > meditateWhenMissing) {
    while (player.mana < player.maxMana) {
      player.useSkill(Skills.Meditation);
      if (journal.containsText(JournalMageryMessages.ENTER)) {
        while (player.mana < player.maxMana) {
          sleep(1000);
        }
      }
      else {
        sleep(4000);
      }
    }
  }

  if (journal.containsText(JournalMageryMessages.REGS_NEEDED)) {
    journal.clear();
    shouldCast = false;
    client.headMsg('>>>Out of Regs<<<', player);
    client.headMsg('<<<Script Off>>>', player);
    break;
  }
  else if (magery < 60) {
    // AJUSTAR: hechizo óptimo para nivel 0-60 de Magery en UA
    player.cast(Spells.MagicReflect);
    sleep(3000);
  }
  else if (magery < 80) {
    // AJUSTAR: hechizo óptimo para nivel 60-80 de Magery en UA
    player.cast(Spells.Invisibility);
    target.waitTargetSelf(6000);
    sleep(spellRecoveryTime);
  }
  else if (magery < 100) {
    // AJUSTAR: hechizo óptimo para nivel 80-100 de Magery en UA
    player.cast(Spells.Earthquake);
    sleep(4000);
  }
  else {
    client.headMsg('YOU DID IT!', player);
    shouldCast = false;
    break;
  }
}
```

---

## 12. Entrenador de Taming

**Tipo:** automática | **Autor:** Shurre | **Servidor:** UOALIVE (requiere adaptación a UA)
**Descripción:** Escanea el área en busca de animales domables según el nivel de skill, se desplaza hasta ellos, los doma y los libera o mata. Macro complejo que muestra múltiples patrones avanzados.
**Patrones:** `client.selectEntity` con opciones de búsqueda, `player.walk(Directions.X)` para movimiento programático, `player.useSkill` con target, `journal.containsText` en bucle con timeout propio, `player.followers`/`player.maxFollowers`, `popupMenu.request`/`popupMenu.reply`, `Gump.findOrWait`/`gump.reply`, `player.getSkill` para lógica de progresión.

```js
/***************************/
/***********ENUMS***********/
/***************************/

// AJUSTAR: todos los textos de JournalResponse son mensajes del servidor.
// Sustituir por los mensajes exactos que emite Ultima Alianza en cada situación.
enum JournalResponse {
  YOU_FAIL = 'You fail to tame',          // AJUSTAR
  YOU_TAME = 'It seems to accept',         // AJUSTAR
  YOU_ANGER = 'You anger the beast',       // AJUSTAR
  TAME_ALREADY = 'That animal looks tame', // AJUSTAR
  NO_CHALLENGE = 'That wasn\'t even challenging', // AJUSTAR
  TOO_MANY_FOLLOWERS = 'You have too many followers', // AJUSTAR
  CANNOT_BE_TAMED = 'That creature cannot'  // AJUSTAR
}

// AJUSTAR: índices del menú contextual de mascotas en UA.
// Abrir el menú contextual de una mascota en el juego para verificar los índices correctos.
enum TameContextMenu {
  RENAME = 0,
  COMMAND_KILL = 1,
  COMMAND_FOLLOW = 2,
  COMMAND_GUARD = 3,
  COMMAND_STOP = 4,
  COMMAND_STAY = 5,
  ADD_FRIEND = 6,
  REMOVE_FRIEND = 7,
  TRANSFER = 8,
  RELEASE = 9 // AJUSTAR: índice de la opción "Liberar" en UA
}

enum KillType {
  MAGERY = 1,
  MELEE = 2,
  TAME = 3
}

/***************************/
/**********CONFIG***********/
/***************************/
let mobileScanRange = 15;
let mobileScanHeight = 6;
let tameRange = 2;
let skillRange = 5;
let followerBaseCount = 0;
// AJUSTAR: serial del gump de confirmación de liberación en UA.
let tamingGump = 0x909CC741;
let shouldRelease = true;
let releaseBeforeKill = true;
let killTamesWith = KillType.MELEE;
let spellRecoveryTime = 1750;
let killSpell = Spells.Fireball;
let walkTimeoutLoops = 200;

let wantedStr = 100;
let wantedDex = 25;
let wantedInt = 100;

// AJUSTAR: listas de gráficos de animales domables por nivel de skill.
// Los gráficos son de UOALIVE. Sustituir por los gráficos de animales disponibles en UA.
// Cada lista corresponde al rango de skill indicado en el comentario.
let UNDERFOURTYFIVE = [0xD8, 0xE7, 0xCF, 0xCB, 0xD1];        // AJUSTAR: skill 0-45
let FOURTYFIVETOSIXTY = [0x122, 0x3F, 0xED, 0xE1, 0xA7, 0xD3, 0xD6]; // AJUSTAR: skill 45-60
let SIXTYTOSEVENTYFIVE = [0x122, 0x3F, 0xED, 0xE1, 0xA7, 0xD3, 0xD6, 0x19, 0xEA]; // AJUSTAR: skill 60-75
let SEVENTYFIVETOEIGHTYFIVE = [0xD4, 0xEA, 0xE9, 0xE8];       // AJUSTAR: skill 75-85
let EIGHTYFIVETOGM = [0xD4, 0xEA, 0xE9, 0xE8];                // AJUSTAR: skill 85-100
let GMTOONETEN = [0x7A];                                        // AJUSTAR: skill 100-110
let ONETENTOONETWENTY = [];                                     // AJUSTAR: skill 110-120

/***************************/
/******* NO MODIFICAR ******/
/***************************/
let MOBILELIST = [];
let IGNORETAMEDLIST = [];
let TAMEABLELIST = [];
let FoundEntity = null;
let tamingBool = true;
let CompareTamedSerial = (mobileList, tameable) => (mobileList.find(mobile => mobile.serial === tameable.serial));
let CompareTamableListFind = (tameableTypeList, foundMobile) => (tameableTypeList.find(tameable => tameable === foundMobile.graphic));

interface InGameObject {
  name?: Mobile['name'];
  type?: string;
  serial?: number;
  x: number;
  y: number;
  z: number;
  graphic: number;
  hue: number;
}

while (tamingBool) {
  CheckSkillSetList();
  sleep(500);
  if (MOBILELIST.length == 0) {
    GetMobileInfo(mobileScanRange);
  }
  if (MOBILELIST.length > 0) {
    MoveToTame(MOBILELIST[0]);
  }
  if (MOBILELIST.length > 0) {
    TameMobile(MOBILELIST[0]);
  }
}

function GetMobileInfo(mobileScanRange) {
  MOBILELIST = [];
  console.log('scanning mobiles');
  for (let i = 0; i < 50; i++) {
    // selectEntity itera por los móviles del área; SearchEntityRangeOptions.Next avanza al siguiente.
    FoundEntity = client.selectEntity(SearchEntityOptions.Any, SearchEntityRangeOptions.Next, SearchEntityTypeOptions.NonHuman, false);
    if (FoundEntity) {
      if (CompareTamableListFind(TAMEABLELIST, FoundEntity)) {
        if (!CompareTamedSerial(MOBILELIST, FoundEntity)) {
          if (!CompareTamedSerial(IGNORETAMEDLIST, FoundEntity)) {
            if (CheckDistanceFromPlayer(FoundEntity) < mobileScanRange && CheckHeightFromPlayer(FoundEntity) < mobileScanHeight) {
              MOBILELIST.push(FoundEntity);
            }
          }
        }
      }
    }
  }
  console.log('List of tameable creatures', MOBILELIST);
  console.log('Mobile ignore list', IGNORETAMEDLIST);
}

function MoveToTame(mobile) {
  let distanceBool = true;
  let ewBool = false;
  let nsBool = false;
  let loopCount = 0;

  while (distanceBool) {
    let myX = player.x;
    let myY = player.y;
    let mobileX = mobile.x;
    let mobileY = mobile.y;
    let distanceEW = player.x - mobileX;
    let distanceNS = player.y - mobileY;

    loopCount++;
    if (loopCount > walkTimeoutLoops) {
      console.log('Ignoring:', mobile.name, mobile.serial);
      IGNORETAMEDLIST.push(mobile);
      if (MOBILELIST.length > 1) {
        MOBILELIST = MOBILELIST.slice(1, MOBILELIST.length);
      } else {
        MOBILELIST = [];
      }
      return;
    }
    if (mobileX === 0 || mobileY === 0) {
      console.log('Mobile location invalid:', 'x:', mobileX, 'y:', mobileY, 'serial:', mobile.serial);
      IGNORETAMEDLIST.push(mobile);
      if (MOBILELIST.length > 1) {
        MOBILELIST = MOBILELIST.slice(1, MOBILELIST.length);
      } else {
        MOBILELIST = [];
      }
      return;
    }
    console.log('Moving to:', mobile.name, mobile.serial);
    sleep(50);
    if ((myX > mobileX && myY > mobileY) && (distanceEW > tameRange && distanceNS > tameRange)) {
      player.walk(Directions.Up);
      continue;
    }
    else if ((myX < mobileX && myY < mobileY) && (distanceEW < -tameRange && distanceNS < -tameRange)) {
      player.walk(Directions.Down);
      continue;
    }
    else if ((myX > mobileX && myY < mobileY) && (distanceEW > tameRange && distanceNS < -tameRange)) {
      player.walk(Directions.Left);
      continue;
    }
    else if ((myX < mobileX && myY > mobileY) && (distanceEW < -tameRange && distanceNS > tameRange)) {
      player.walk(Directions.Right);
      continue;
    }
    if (myX > mobileX && distanceEW > tameRange) {
      player.walk(Directions.West);
      continue;
    }
    else if (myX < mobileX && distanceEW < -tameRange) {
      player.walk(Directions.East);
      continue;
    }
    else {
      ewBool = true;
    }
    if (myY > mobileY && distanceNS > tameRange) {
      player.walk(Directions.North);
      continue;
    }
    else if (myY < mobileY && distanceNS < -tameRange) {
      player.walk(Directions.South);
      continue;
    }
    else {
      nsBool = true;
    }
    if (ewBool && nsBool) {
      distanceBool = false;
    }
  }
  console.log('At location');
}

function CheckDistanceFromPlayer(mobile) {
  let distanceX = player.x - mobile.x;
  let distanceY = player.y - mobile.y;
  if (distanceX < 0) { distanceX = mobile.x - player.x; }
  if (distanceY < 0) { distanceY = mobile.y - player.y; }
  if (distanceX > distanceY) { return distanceX; }
  else { return distanceY; }
}

function CheckHeightFromPlayer(mobile) {
  let distanceZ = player.z - mobile.z;
  if (distanceZ < 0) { distanceZ = mobile.z - player.z; }
  return distanceZ;
}

function TameMobile(mobile) {
  let tameName = mobile.name;
  let tamedBool = false;

  while (!tamedBool) {
    if (player.followers < player.maxFollowers) {
      if (CheckDistanceFromPlayer(mobile) <= tameRange) {
        console.log('Taming:', tameName, mobile.serial);
        journal.clear();
        player.useSkill('AnimalTaming', mobile.serial);
      }
      else {
        if (mobile.serial != null && mobile.x > 0 && mobile.y > 0) {
          console.log('Moving Closer to:', mobile.serial);
        }
        MoveToTame(mobile);
      }
    }
    else {
      client.headMsg('Too Many Followers', player);
      return;
    }

    let TIMEOUT = 40;
    let LOOPSLEEP = 500;
    for (let i = 0; i < TIMEOUT; i++) {
      if (journal.containsText(JournalResponse.YOU_TAME, mobile.name)) {
        IGNORETAMEDLIST.push(mobile);
        MOBILELIST = MOBILELIST.slice(1, MOBILELIST.length);
        tamedBool = true;
        if (shouldRelease) { KillTame(mobile); }
        return;
      }
      if (journal.containsText(JournalResponse.NO_CHALLENGE, 'System')) {
        IGNORETAMEDLIST.push(mobile);
        MOBILELIST = MOBILELIST.slice(1, MOBILELIST.length);
        tamedBool = true;
        if (shouldRelease) { KillTame(mobile); }
        return;
      }
      if (journal.containsText(JournalResponse.TAME_ALREADY, mobile.name)) {
        IGNORETAMEDLIST.push(mobile);
        MOBILELIST = MOBILELIST.slice(1, MOBILELIST.length);
        tamedBool = true;
        if (shouldRelease) { KillTame(mobile); }
        return;
      }
      if (journal.containsText(JournalResponse.TOO_MANY_FOLLOWERS, 'System')) {
        client.headMsg('Too Many!', player);
        break;
      }
      if (journal.containsText(JournalResponse.YOU_FAIL, mobile.name)) {
        break;
      }
      if (journal.containsText(JournalResponse.CANNOT_BE_TAMED, mobile.name)) {
        IGNORETAMEDLIST.push(mobile);
        MOBILELIST = MOBILELIST.slice(1, MOBILELIST.length);
        tamedBool = true;
        return;
      }
      if (CheckDistanceFromPlayer(mobile) > 5) {
        console.log('Moving to tame');
        if (MOBILELIST[0].serial != null && mobile.serial != null) {
          if (MOBILELIST[0].serial === mobile.serial) {
            MoveToTame(mobile);
          }
          else {
            return;
          }
          return;
        }
      }
      sleep(LOOPSLEEP);
    }
  }
}

function KillTame(mobile) {
  player.say('All Follow Me');
  player.say('All Guard Me');

  if (releaseBeforeKill) {
    // Abrir el menú contextual del animal y seleccionar la opción de liberar.
    popupMenu.request(mobile.serial);
    popupMenu.waitUntilOpen(1000);
    popupMenu.reply(TameContextMenu.RELEASE); // AJUSTAR: verificar el índice en UA

    // Confirmar en el gump de confirmación.
    // AJUSTAR: tamingGump es el serial del gump de confirmación de UA.
    let gump = Gump.findOrWait(tamingGump, 3000);
    gump.reply(2); // AJUSTAR: índice del botón de confirmación en UA
    sleep(1000);
  }

  switch (killTamesWith) {
    case KillType.MAGERY: {
      let thisMobile = client.findObject(mobile.serial);
      while (thisMobile) {
        if (CheckDistanceFromPlayer(mobile) > 5) {
          MoveToTame(mobile);
        }
        player.cast(Spells.Fireball);
        target.waitTargetEntity(mobile.serial);
        sleep(spellRecoveryTime);
      }
      break;
    }
    case KillType.MELEE: {
      let thisMobile = client.findObject(mobile.serial);
      let attacking = true;
      while (attacking) {
        if (thisMobile.hits != null) {
          if (thisMobile.hits > 0) {
            player.attack(mobile.serial);
            sleep(5000);
          }
          else {
            attacking = false;
            return;
          }
        }
      }
      break;
    }
    case KillType.TAME: {
      let thisMobile = client.findObject(mobile.serial);
      while (thisMobile.hits > 0) {
        player.say('All Kill');
        target.waitTargetEntity(mobile.serial);
        sleep(3000);
      }
      break;
    }
  }
}

function CheckSkillSetList() {
  let tamingSkill = player.getSkill(Skills.AnimalTaming).value;
  if (tamingSkill < 450)       { TAMEABLELIST = UNDERFOURTYFIVE; }
  else if (tamingSkill < 600)  { TAMEABLELIST = FOURTYFIVETOSIXTY; }
  else if (tamingSkill < 750)  { TAMEABLELIST = SIXTYTOSEVENTYFIVE; }
  else if (tamingSkill < 850)  { TAMEABLELIST = SEVENTYFIVETOEIGHTYFIVE; }
  else if (tamingSkill < 1000) { TAMEABLELIST = EIGHTYFIVETOGM; }
  else if (tamingSkill < 1100) { TAMEABLELIST = GMTOONETEN; }
  else if (tamingSkill < 1200) { TAMEABLELIST = ONETENTOONETWENTY; }
}
```
