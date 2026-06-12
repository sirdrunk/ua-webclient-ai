# ClassicUO Web Client — Scripting API Context Pack

> Generado con IA el 2026-06-12 | Fuente oficial: https://www.classicuo.org/scripting/
> Pega este archivo como contexto/system prompt en cualquier IA para obtener ayuda precisa escribiendo macros para el cliente web Classic de Ultima Online.

---

## Qué es esto

Los macros de ClassicUO Web se escriben en **TypeScript** y se ejecutan directamente en el navegador (Chrome). No hay compilación ni bundler. El motor del cliente inyecta un conjunto de variables globales en cada script.

---

## Funciones globales

```ts
sleep(ms: number): void          // pausa la ejecución N ms (precisión no garantizada en duraciones largas)
log(...args: any[]): void        // imprime en la consola del scripting
exit(reason?: string): void      // termina la ejecución del script
```

---

## Variables globales

| Variable | Descripción |
|----------|-------------|
| `player` | El personaje del jugador actual |
| `client` | Interacción con el cliente: búsquedas, mensajes en pantalla |
| `target` | Sistema de objetivos |
| `journal` | Historial de mensajes del servidor |
| `ignoreList` | Lista de seriales excluidos de búsquedas |
| `popupMenu` | Menús contextuales (clic derecho) |
| `prompt` | Prompts de texto en el chat |
| `worldMap` | Mapa del mundo |

---

## Jerarquía de tipos

```
GameObject { serial, graphic, hue, x, y, z }
  └─ Entity  { + direction, hits, maxHits, name, isHidden }
       └─ Mobile { + mana, maxMana, stamina, maxStamina, notoriety,
       |            isPoisoned, isDead, isParalyzed, isHidden,
       |            isYellowHits, inWarMode, isFemale, equippedItems }
       └─ Player  { + strength, dexterity, intelligence,
                     backpack, weight, weightMax, gold,
                     physicalResistance, fireResistance, coldResistance,
                     poisonResistance, energyResistance,
                     damageMin, damageMax, damageIncrease,
                     fasterCasting, fasterCastRecovery,
                     lowerManaCost, lowerReagentCost, spellDamageIncrease,
                     defenseChanceIncrease, hitChanceIncrease, swingSpeedIncrease,
                     followers, maxFollowers, luck, tithingPoints,
                     primaryAbility, secondaryAbility, statsCap, map }

Item extends Entity { amount, container, contents, layer }

SerialOrEntity = number | GameObject | SerialObject
```

---

## player

### Propiedades de estado (flags)

```ts
player.isPoisoned: boolean      // envenenado (hue verde)
player.isDead: boolean
player.isHidden: boolean
player.isParalyzed: boolean
player.isYellowHits: boolean    // invulnerable
player.inWarMode: boolean
player.hits / player.maxHits: number
player.mana / player.maxMana: number
player.stamina / player.maxStamina: number
player.strength / player.dexterity / player.intelligence: number
player.serial: number
player.name: string
player.x / player.y / player.z: number
player.backpack: Item | undefined
```

### Métodos

```ts
// Comunicación
player.say(message: string, hue?: number): void

// Items
player.use(serial: SerialOrEntity): void
player.useType(graphic: number, hue?: number, sourceSerial?: SerialOrEntity, range?: number): boolean
player.useItemInHand(): void
player.useLastObject(): void
player.equip(serial: SerialOrEntity): void
player.click(serial: SerialOrEntity): void
player.moveItem(serial, container, x?, y?, z?, amount?): number
player.moveType(graphic, src, dest, x?, y?, z?, hue?, amount?, range?): number

// Combate
player.attack(serial: SerialOrEntity): void
player.setAbility(primary: boolean, active: boolean): void
player.toggleWarMode(): void

// Hechizos y habilidades
player.cast(spell: any): void
player.castTo(spell: any, serial: SerialOrEntity, timeout?: number): void
player.useSkill(skill: any, target?: SerialOrEntity, timeout?: number): void
player.useVirtue(virtue: any, target?: SerialOrEntity, timeout?: number): void

// Movimiento
player.walk(direction: Directions): boolean
player.run(direction: Directions): boolean
player.openDoor(): void

// Emotes
player.bow(): void
player.salute(): void

// Vuelo (solo Gargoyle)
player.fly(): void
player.land(): void
player.toggleFlying(): void

// Skills
player.getSkill(skill: Skills): { value, base, cap, lock, index, canBeUsable }
// ⚠ value es entero sin decimales: 746 = 74.6%
player.getAllSkills(): object[]
player.setSkillLock(skill: Skills, lock: SkillLock): void

// Buffs/debuffs
player.hasBuffDebuff(buffID: BuffDebuffs): boolean
player.waitForBuffDebuff(buffId: BuffDebuffs, timeoutMs?: number): null | boolean
```

### equippedItems slots

`arms, beard, bracelet, cloak, earrings, face, gloves, hair, helmet, legs, mount, necklace, oneHanded, pants, ring, robe, shirt, shoes, skirt, talisman, torso, tunic, twoHanded, waist`

---

## client

```ts
// Búsqueda de objetos
client.findType(graphic, hue?, sourceSerial?, amount?, range?): Item | Mobile | null
client.findAllOfType(graphic, hue?, sourceSerial?, amount?, range?): (Item | Mobile)[]
client.findAllItemsOfType(graphic, hue?, sourceSerial?, amount?, range?): Item[]
client.findAllMobilesOfType(graphic, hue?, sourceSerial?, amount?, range?): Mobile[]
client.findObject(serial, hue?, sourceSerial?, amount?, range?): any
client.findItemOnLayer(serial: SerialOrEntity, layer: Layers): Item | null
client.selectEntity(searchOpt, searchRangeOpt, searchTypeOpt, asFriend: boolean): Mobile | null

// Mensajes en pantalla
client.headMsg(message: string, serial: SerialOrEntity | "world", hue?: number): void
client.sysMsg(message: string, hue?: number): void

// Información de items
client.queryItemOPL(serial, timeout?): object  // { name, properties, amount, graphic, hue, ... }
client.queryItemSingleClickName(serial, timeout?): string

// UI
client.closeAllGumps(): void
client.closeCorpses(): void
client.closeAllHealthBars(): void
client.openPaperdoll(serial?): void
client.toggleNameOverheads(): void
client.toggleAuras(): void
client.zoomIn(): void
client.zoomOut(): void
client.zoomReset(): void
client.allNames(): void
client.getPing(): number
client.quitGame(): void

// Vendedores
client.sendBuyRequest(vendorSerial, items: object[]): boolean
client.sendSellRequest(vendorSerial, items: object[]): boolean

// Terreno
client.getStatic(graphic: number): object | undefined
client.getTile(graphic: number): object | undefined
client.getTerrainList(x: number, y: number): object[] | undefined
```

---

## target

```ts
// Propiedades
target.last: Item | Mobile | undefined    // último objeto apuntado
target.lastSerial: number
target.lastObject: Item | undefined       // último objeto usado con doble clic
target.lastObjectSerial: number
target.open: boolean                      // si hay cursor de objetivo activo

// Métodos
target.wait(timeoutMs?: number): boolean          // espera a que aparezca el cursor
target.self(): void                               // apunta al jugador (cursor debe estar abierto)
target.entity(serial: SerialOrEntity): void       // apunta a entidad (cursor debe estar abierto)
target.terrain(x, y, z, graphic?): void           // apunta a coordenadas
target.terrainWithOffset(x, y, z, graphic?): void // coordenadas relativas al jugador
target.repeatLast(): void

// Métodos atómicos (esperar + apuntar en una llamada)
target.waitTargetSelf(timeoutMs?: number): boolean
target.waitTargetEntity(entity: SerialOrEntity, timeoutMs?: number): boolean
target.waitTargetType(graphic, hue?, timeoutMs?): boolean

target.cancel(): void
target.clearQueue(): void
target.query(isGround?: boolean): TargetInfo
```

### Patrones de targeting

```ts
// Patrón 1 — dos pasos (permite lógica entre esperar y apuntar)
player.cast(Spells.Heal);
target.wait();
target.self();

// Patrón 2 — atómico (recomendado para casos simples)
player.useType(0xe21); // vendaje
target.waitTargetSelf();

// Patrón 3 — apuntar a entidad específica
player.cast(Spells.Heal);
target.wait();
target.entity(someSerial);
```

---

## journal

```ts
journal.clear(): void
journal.containsText(text: string, author?: string): boolean
journal.waitForText(text: string, author?: string, timeout?: number): boolean
journal.waitForTextAny(text: string[], author?: string, timeout?: number): null | string
// devuelve el primer string encontrado, o null si expira el timeout
journal.waitForTextEvery(text: string[], author?: string, timeout?: number): string[]
// devuelve todos los strings encontrados antes del timeout
```

### Ejemplo — waitForTextAny

```ts
const waitMsg    = 'You must wait';
const failMsg    = 'You cannot focus';
const successMsg = 'You enter a meditative trance.';

journal.clear();
const response = journal.waitForTextAny([waitMsg, failMsg, successMsg]);

switch (response) {
  case waitMsg:    { sleep(2000); break; }
  case failMsg:    { break; }
  case successMsg: { /* continuar */ break; }
}
```

---

## Gump

```ts
// Estáticos
Gump.last: Gump | null
Gump.lastSerial: number
Gump.lastVendorBuyData: object | undefined
Gump.lastVendorSellData: object | undefined
Gump.findOrWait(serialOrText: string | number, timeoutMs?: number, fromServer?: boolean): Gump | undefined
Gump.exists(serial: number): boolean
Gump.closeAll(): void

// Instancia
gump.exists: boolean
gump.serial: number
gump.reply(buttonID: number): void
gump.containsText(value: string): boolean
gump.hasButton(id: number): boolean
gump.setTextEntry(localSerial: number, value: string): void
gump.setCheckbox(serial: number, value: boolean): void
gump.close(): void
```

---

## ignoreList

```ts
ignoreList.values: number[]
ignoreList.add(serial: SerialOrEntity): boolean
ignoreList.remove(serial: SerialOrEntity): boolean
ignoreList.contains(serial: SerialOrEntity): boolean
ignoreList.clear(): void
ignoreList.replace(values: number[]): void
```

---

## popupMenu

```ts
popupMenu.exists: boolean
popupMenu.request(serial: number, waitMs?: number): boolean | undefined
popupMenu.waitUntilOpen(timeoutMs?: number): boolean
popupMenu.waitForContent(timeoutMs?: number): object | null
popupMenu.reply(index: number): void   // 0 = primera opción
popupMenu.close(): void
```

---

## prompt

```ts
prompt.exists: boolean
prompt.waitUntilOpen(timeoutMs?: number): boolean
prompt.reply(value: string): void
```

---

## worldMap

```ts
worldMap.markers: readonly WorldMapMarker[]
worldMap.open(): void
worldMap.close(): void
worldMap.goTo(coords: { x: number; y: number }): void
worldMap.addMarker(marker): WorldMapMarker
worldMap.removeMarker(marker: string | object): boolean
worldMap.removeAllMarkers(): void
worldMap.parseLocation(input: string): object | undefined  // soporta coordenadas sextante
```

---

## Enumeraciones principales

### Directions
`North=0, Right=1, East=2, Down=3, South=4, Left=5, West=6, Up=7`

### Notorieties
`Unknown=0, Innocent=1, Ally=2, Gray=3, Criminal=4, Enemy=5, Murderer=6, Invulnerable=7`

### Layers
`Invalid=0, OneHanded=1, TwoHanded=2, Shoes=3, Pants=4, Shirt=5, Helmet=6, Gloves=7, Ring=8, Talisman=9, Necklace=10, Hair=11, Waist=12, Torso=13, Bracelet=14, Face=15, Beard=16, Tunic=17, Earrings=18, Arms=19, Cloak=20, Backpack=21, Robe=22, Skirt=23, Legs=24, Mount=25, ShopBuyRestock=26, ShopBuy=27, ShopSell=28, Bank=29`

### Skills (58 total)
`Alchemy=0, Anatomy=1, AnimalLore=2, ItemID=3, ArmsLore=4, Parry=5, Begging=6, Blacksmith=7, Fletching=8, Peacemaking=9, Camping=10, Carpentry=11, Cartography=12, Cooking=13, DetectHidden=14, Discordance=15, EvalInt=16, Healing=17, Fishing=18, Forensics=19, Herding=20, Hiding=21, Provocation=22, Inscribe=23, Lockpicking=24, Magery=25, MagicResist=26, Tactics=27, Snooping=28, Musicianship=29, Poisoning=30, Archery=31, SpiritSpeak=32, Stealing=33, Tailoring=34, AnimalTaming=35, TasteID=36, Tinkering=37, Tracking=38, Veterinary=39, Swords=40, Macing=41, Fencing=42, Wrestling=43, Lumberjacking=44, Mining=45, Meditation=46, Stealth=47, RemoveTrap=48, Necromancy=49, Focus=50, Chivalry=51, Bushido=52, Ninjitsu=53, Spellweaving=54, Mysticism=55, Imbuing=56, Throwing=57`

### SkillLock
`Up=0, Down=1, Locked=2`

### MessageType
`Regular=0, System=1, Emote=2, Limit3Spell=3, Label=6, Focus=7, Whisper=8, Yell=9, Spell=10, Guild=13, Alliance=14, Command=15, Encoded=192, UOChat=254, Party=255`

### SearchEntityOptions (flags combinables)
`Any=1, Enemy=2, Murderer=4, Criminal=8, Gray=16, Innocent=32, Unfriendly=64, Friend=128, Invulnerable=256`

### SearchEntityRangeOptions
`Next=0, Previous=1, Nearest=2, Closest=3`

### SearchEntityTypeOptions
`Any=0, Human=1, NonHuman=2`

### Virtues
`Honor=1, Sacrifice=2, Valor=3`

---

## Patrones comunes

### Macro básico con while(true)

```ts
// ⚠ En reposo (hits = max): sleep(500) → 0 paquetes al servidor
// ⚠ En combate (hits < max): sleep(500) NUNCA se ejecuta → bucle activo permanente
// ⚠ Añadir siempre sleep tras fallo para evitar tormenta de paquetes bajo lag

while (true) {
  if (player.hits < player.maxHits && !player.isPoisoned) {
    // lógica de curación
  } else {
    sleep(500);
  }
}
```

### Usar vendajes

```ts
// Opción 1 — por graphic ID (estándar)
player.useType(0xe21);
target.waitTargetSelf();

// Opción 2 — comando custom de servidor
player.say(".vendas");
target.wait();
target.self();
journal.clear();
const ok = journal.waitForText("intentando curarse", undefined, 3000);
```

### Iterar todos los items de un tipo

```ts
let item: Item | Mobile;
while ((item = client.findType(0xeed))) {
  log(`Serial: ${item.serial}`);
  ignoreList.add(item);
}
ignoreList.clear();
```

### Abrir gump y responder

```ts
player.use(someSerial);
const gump = Gump.findOrWait(0x59, 1000);
if (!gump) exit("Gump no encontrado");
gump.reply(1);
```

---

## Errores frecuentes

| ❌ Incorrecto | ✅ Correcto | Nota |
|---|---|---|
| `player.dex` | `player.dexterity` | nombre completo |
| `player.str` | `player.strength` | nombre completo |
| `player.int` | `player.intelligence` | nombre completo |
| `client.isPoisoned()` | `player.isPoisoned` | es propiedad de player/mobile |
| `target.waitTarget()` | `target.wait()` | nombre correcto |
| `target.setTargetToSelf()` | `target.self()` | nombre correcto |
| `Math.round(secs)` para countdown | `Math.floor(secs)` | evita resto negativo |
| Sin sleep tras fallo | `sleep(2000)` tras fallo | evita retry storm en lag |
| `!!valor` siendo valor ya boolean | `valor` directamente | redundante |
