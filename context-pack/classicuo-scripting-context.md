# ClassicUO Web Client — Scripting API Reference

Fuente oficial: https://www.classicuo.org/scripting/
Documentacion descargada el 2026-06-12 desde https://github.com/ClassicUO/classicuo-web/tree/main/site/scripting

---

## Entorno de ejecucion

Los macros de ClassicUO Web se escriben en TypeScript y se ejecutan directamente en el navegador (Chrome). No hay compilacion previa ni bundler. El motor del cliente inyecta un conjunto de variables globales en cada script antes de ejecutarlo. El contexto de ejecucion es unico por sesion de macro.

---

## Funciones globales

```ts
sleep(ms: number): void
```
Pausa la ejecucion durante N milisegundos. La precision no esta garantizada para duraciones largas. Toda iteracion de bucle que no realice trabajo debe incluir un `sleep` para evitar tormenta de paquetes al servidor.

```ts
log(...args: any[]): void
```
Imprime en la consola de scripting del cliente. Acepta cualquier numero de argumentos de cualquier tipo.

```ts
exit(reason?: string): void
```
Termina la ejecucion del script inmediatamente. El argumento opcional se muestra como motivo en la consola.

---

## Variables globales

| Variable      | Tipo       | Descripcion                                              |
|---------------|------------|----------------------------------------------------------|
| `player`      | `Player`   | El personaje del jugador actual                          |
| `client`      | `Client`   | Interaccion con el cliente: busquedas, mensajes, UI      |
| `target`      | `Target`   | Sistema de objetivos                                     |
| `journal`     | `Journal`  | Historial de mensajes recibidos del servidor             |
| `ignoreList`  | `IgnoreList` | Lista de seriales excluidos de las busquedas de `client` |
| `popupMenu`   | `PopupMenu`  | Menus contextuales (clic derecho sobre entidades)        |
| `prompt`      | `Prompt`   | Prompts de texto en el chat                              |
| `worldMap`    | `WorldMap` | Mapa del mundo                                           |

---

## Jerarquia de tipos

```
GameObject
  serial: number
  graphic: number
  hue: number
  x: number
  y: number
  z: number

  Entity extends GameObject
    direction: number         (comparar con enum Directions)
    hits: number
    maxHits: number
    name: string
    isHidden: boolean

    Mobile extends Entity
      mana: number
      maxMana: number
      stamina: number
      maxStamina: number
      notoriety: Notorieties
      isPoisoned: boolean     (hue verde)
      isDead: boolean
      isParalyzed: boolean
      isYellowHits: boolean   (estado invulnerable)
      inWarMode: boolean
      isFemale: boolean
      equippedItems: object   (ver slots mas abajo)

      Player extends Mobile
        strength: number
        dexterity: number
        intelligence: number
        backpack: Item | undefined
        weight: number
        weightMax: number
        gold: number
        physicalResistance: number
        fireResistance: number
        coldResistance: number
        poisonResistance: number
        energyResistance: number
        maxPhysicResistence: number
        maxFireResistence: number
        maxColdResistence: number
        maxPoisonResistence: number
        maxEnergyResistence: number
        maxDefenseChanceIncrease: number
        damageMin: number
        damageMax: number
        damageIncrease: number
        fasterCasting: number
        fasterCastRecovery: number
        lowerManaCost: number
        lowerReagentCost: number
        spellDamageIncrease: number
        defenseChanceIncrease: number
        hitChanceIncrease: number
        swingSpeedIncrease: number
        followers: number
        maxFollowers: number
        luck: number
        tithingPoints: number
        primaryAbility: Abilities
        secondaryAbility: Abilities
        statsCap: number
        map: number

  Item extends Entity
    amount: number
    container: number         (serial del contenedor, 0 si no tiene)
    contents: Item[]          (items dentro si es un contenedor)
    layer: Layers

SerialOrEntity = number | GameObject | SerialObject
SerialObject   = { serial: number }
```

Los tipos `Mobile` e `Item` tienen un campo discriminante `_tag` para narrowing de tipo:
- `Mobile._tag === 'Mobile'`
- `Item._tag === 'Item'`

Util cuando una funcion devuelve `Item | Mobile` y necesitas tratar cada caso de forma diferente.

NOTA: Para `mana`, `maxMana`, `stamina`, `maxStamina`: en el jugador devuelven el valor real; en otros mobiles devuelven una escala de 1 a 100.

---

## player

### Propiedades de estado

```ts
player.isPoisoned: boolean
player.isDead: boolean
player.isHidden: boolean
player.isParalyzed: boolean
player.isYellowHits: boolean
player.inWarMode: boolean
player.hits: number
player.maxHits: number
player.mana: number
player.maxMana: number
player.stamina: number
player.maxStamina: number
player.strength: number
player.dexterity: number
player.intelligence: number
player.serial: number
player.name: string
player.x: number
player.y: number
player.z: number
player.backpack: Item | undefined
player.gold: number
player.weight: number
player.weightMax: number
player.primaryAbility: Abilities
player.secondaryAbility: Abilities
player.map: number
```

### equippedItems — slots disponibles

`arms, beard, bracelet, cloak, earrings, face, gloves, hair, helmet, legs, mount, necklace, oneHanded, pants, ring, robe, shirt, shoes, skirt, talisman, torso, tunic, twoHanded, waist`

Ejemplo de acceso: `player.equippedItems.robe`, `player.equippedItems.oneHanded`

### Metodos — Comunicacion

```ts
player.say(message: string, hue?: number): void
```

### Metodos — Uso de items

```ts
player.use(serial: SerialOrEntity): void
player.useType(graphic: number, hue?: number, sourceSerial?: SerialOrEntity, range?: number): boolean
player.useItemInHand(): void
player.useLastObject(): void
player.equip(serial: SerialOrEntity): void
player.click(serial: SerialOrEntity): void
player.moveItem(serial: SerialOrEntity, container: SerialOrEntity, x?: number, y?: number, z?: number, amount?: number): number
player.moveItemOnGroundOffset(serial: SerialOrEntity, x?: number, y?: number, z?: number, amount?: number): number
player.moveType(graphic: number, src: SerialOrEntity, dest: SerialOrEntity, x?: number, y?: number, z?: number, hue?: number, amount?: number, range?: number): number
player.moveTypeOnGroundOffset(graphic: number, src: SerialOrEntity, x?: number, y?: number, z?: number, hue?: number, amount?: number, range?: number): number
player.dressKr(items: (number | Item)[]): void
player.undressKr(layers: Layers[]): void
```

### Metodos — Combate

```ts
player.attack(serial: SerialOrEntity): void
player.setAbility(primary: boolean, active: boolean): void
player.toggleWarMode(): void
```

`setAbility(true, false)` desactiva habilidad primaria; `setAbility(false, true)` activa habilidad secundaria.

### Metodos — Hechizos y habilidades

```ts
player.cast(spell: Spells | number): void
player.castTo(spell: Spells | number, serial: SerialOrEntity, timeout?: number): void
player.useSkill(skill: Skills | number, target?: SerialOrEntity, timeout?: number): void
player.useVirtue(virtue: Virtues | number, target?: SerialOrEntity, timeout?: number): void
```

`castTo` lanza el hechizo y automaticamente apunta a la entidad indicada en el siguiente target cursor.

### Metodos — Movimiento

```ts
player.walk(direction: Directions): boolean
player.run(direction: Directions): boolean
player.openDoor(): void
```

`walk` y `run` devuelven `true` si el movimiento es posible.

### Metodos — Vuelo (exclusivo Gargoyle)

```ts
player.fly(): void
player.land(): void
player.toggleFlying(): void
```

### Metodos — Emotes

```ts
player.bow(): void
player.salute(): void
```

### Metodos — Skills

```ts
player.getSkill(skill: Skills): { value: number, base: number, cap: number, lock: SkillLock, index: number, name: string, canBeUsable: boolean } | undefined
player.getAllSkills(): object[] | undefined
player.setSkillLock(skill: Skills, lock: SkillLock): void
```

NOTA CRITICA: `value` es un entero sin decimales. El valor real 74.6 se devuelve como `746`. Dividir por 10 para obtener el valor con decimal.

### Metodos — Buffs y debuffs

```ts
player.hasBuffDebuff(buffID: BuffDebuffs): boolean
player.waitForBuffDebuff(buffId: BuffDebuffs, timeoutMs?: number): boolean | null
```

`waitForBuffDebuff` devuelve `true` si el buff/debuff esta presente, `false` si expira el timeout, `null` si ocurre un error.

---

## client

### Busqueda de objetos

```ts
client.findType(graphic: number, hue?: number | null, sourceSerial?: SerialOrEntity | null, amount?: number | null, range?: number | null): Item | Mobile | null
```
Busca el primer objeto con el graphic indicado. El parametro `range` cuando se combina con un `sourceSerial` contenedor especifica la profundidad de busqueda (0 = solo el contenedor directo, sin sub-contenedores).

```ts
client.findAllOfType(graphic: number, hue?: number | null, sourceSerial?: SerialOrEntity | null, amount?: number | null, range?: number | null): (Item | Mobile)[]
client.findAllItemsOfType(graphic: number, hue?: number | null, sourceSerial?: SerialOrEntity | null, amount?: number | null, range?: number | null): Item[]
client.findAllMobilesOfType(graphic: number, hue?: number | null, sourceSerial?: SerialOrEntity | null, amount?: number | null, range?: number | null): Mobile[]
client.findObject(serial: SerialOrEntity, hue?: number | null, sourceSerial?: SerialOrEntity | null, amount?: number | null, range?: number | null): any
client.findItemOnLayer(serial: SerialOrEntity, layer: Layers): Item | null
client.selectEntity(searchOpt: SearchEntityOptions, searchRangeOpt: SearchEntityRangeOptions, searchTypeOpt: SearchEntityTypeOptions, asFriend: boolean): Mobile | null
```

`selectEntity` acepta flags combinados con `|` para `searchOpt`. Ejemplo: `SearchEntityOptions.Enemy | SearchEntityOptions.Gray`.

### Mensajes en pantalla

```ts
client.headMsg(message: string, serial: SerialOrEntity | "world", hue?: number): void
client.sysMsg(message: string, hue?: number): void
```

`headMsg` muestra el mensaje sobre la entidad indicada. Si `serial` es `"world"` o `Constant.WorldSerial`, el mensaje se muestra en el centro de la pantalla.

### Informacion de items

```ts
client.queryItemOPL(serial: SerialOrEntity, timeout?: number): {
  name: string;
  properties: object[] | null;
  data: string | null;
  amount: number;
  graphic: number;
  hue: number;
  isPartialHue: boolean;
  serial: number;
}
client.queryItemSingleClickName(serial: SerialOrEntity, timeout?: number): string
```

### Interfaz de usuario

```ts
client.closeAllGumps(): void
client.closeCorpses(): void
client.closeAllHealthBars(): void
client.closeInactiveHealthBars(): void
client.openPaperdoll(serial?: SerialOrEntity): void
client.toggleNameOverheads(): void
client.toggleAuras(): void
client.toggleCircleOfTransparency(): void
client.toggleAlwaysRun(): void
client.toggleChatVisibility(): void
client.zoomIn(): void
client.zoomOut(): void
client.zoomReset(): void
client.allNames(): void
client.setGrabBag(): void
client.getPing(): number
client.quitGame(): void
```

`closeAllGumps` no cierra la barra superior, la barra de buffs ni el minimapa. `closeInactiveHealthBars` cierra barras de entidades muertas o fuera de pantalla.

### Vendedores

```ts
client.sendBuyRequest(vendorSerial: SerialOrEntity, items: object[]): boolean
client.sendSellRequest(vendorSerial: SerialOrEntity, items: object[]): boolean
```

Los items se obtienen tipicamente de `Gump.lastVendorBuyData.items` o `Gump.lastVendorSellData.items`.

### Terreno

```ts
client.getStatic(graphic: number): object | undefined
client.getTile(graphic: number): object | undefined
client.getTerrainList(x: number, y: number): object[] | undefined
```

---

## target

### Propiedades

```ts
target.last: Item | Mobile | undefined       // ultima entidad apuntada
target.lastSerial: number
target.lastObject: Item | undefined          // ultimo objeto usado con doble clic
target.lastObjectSerial: number
target.open: boolean                         // true si hay cursor de objetivo activo
```

### Metodos — espera

```ts
target.wait(timeoutMs?: number): boolean
```
Espera hasta que aparezca el cursor de objetivo. Devuelve `true` si el cursor se abrio; `false` si expiro el timeout. El timeout por defecto es indefinido (espera sin limite).

### Metodos — apuntar (requieren cursor abierto)

```ts
target.self(): void
target.entity(serial: SerialOrEntity): void
target.terrain(x: number, y: number, z: number, graphic?: number): void
target.terrainWithOffset(x: number, y: number, z: number, graphic?: number): void
target.terrainRelativeToEntity(entity: SerialOrEntity, range: number, forward: boolean, graphic?: number): void
target.repeatLast(): void
```

`terrain` apunta a coordenadas absolutas. `terrainWithOffset` usa coordenadas relativas al jugador. Cuando `graphic` se omite, apunta a LAND por defecto.

`terrainRelativeToEntity` apunta a un tile en relacion a la posicion de una entidad especifica. `forward: true` apunta en la direccion en que mira la entidad; `forward: false` apunta detras.

### Metodos — atomicos (espera + apunta en una sola llamada)

```ts
target.waitTargetSelf(timeoutMs?: number): boolean
target.waitTargetEntity(entity: SerialOrEntity, timeoutMs?: number): boolean
target.waitTargetType(graphic: number, hue?: number, timeoutMs?: number): boolean
```

Estos metodos combinan `target.wait()` y la accion de apuntar en una sola llamada. Devuelven `true` si el cursor se abrio y se apunto correctamente.

### Metodos — control

```ts
target.cancel(): void
target.clearQueue(): void
target.query(isGround?: boolean): TargetInfo
```

`query` abre un cursor de objetivo y espera a que el jugador apunte manualmente; devuelve informacion sobre lo seleccionado.

### Patrones de targeting

```ts
// Patron 1 — dos pasos (permite logica entre esperar y apuntar)
player.cast(Spells.Heal);
target.wait();
target.self();

// Patron 2 — atomico (recomendado para casos simples)
player.useType(0xe21);
target.waitTargetSelf();

// Patron 3 — apuntar a entidad especifica
player.cast(Spells.Heal);
target.wait();
target.entity(someSerial);

// Patron 4 — castTo (cast + target en una sola llamada)
player.castTo(Spells.Heal, player);
```

---

## journal

```ts
journal.clear(): void
journal.containsText(text: string, author?: string): boolean
journal.waitForText(text: string, author?: string, timeout?: number): boolean
journal.waitForTextAny(text: string[], author?: string, timeout?: number): string | null
journal.waitForTextEvery(text: string[], author?: string, timeout?: number): string[]
```

`waitForTextAny` devuelve el primer string del array encontrado en el journal, o `null` si expira el timeout.
`waitForTextEvery` devuelve un array con todos los strings del array encontrados antes del timeout.
`author` filtra por nombre de quien envia el mensaje; `undefined` busca en todos.

### Ejemplo de uso

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
  case null:       { /* timeout */ break; }
}
```

---

## Gump

### Propiedades estaticas

```ts
Gump.last: Gump | null
Gump.lastSerial: number
Gump.lastVendorBuyData: object | undefined
Gump.lastVendorSellData: object | undefined
```

`lastVendorBuyData` y `lastVendorSellData` contienen la estructura `{ vendor, type, items }` del ultimo gump de compra/venta recibido del servidor.

### Metodos estaticos

```ts
Gump.findOrWait(serialOrText: string | number, timeoutMs?: number, fromServer?: boolean): Gump | undefined
Gump.exists(serial: number): boolean
Gump.closeAll(): void
```

`findOrWait` busca un gump por su serial numerico o por texto contenido. El timeout por defecto es 5000 ms. `fromServer: false` busca gumps locales (no de servidor).

### Propiedades de instancia

```ts
gump.exists: boolean
gump.serial: number
```

### Metodos de instancia

```ts
gump.reply(buttonID: number): void
gump.containsText(value: string): boolean     // busqueda case-insensitive
gump.hasButton(id: number): boolean
gump.setTextEntry(localSerial: number, value: string): void
gump.setCheckbox(serial: number, value: boolean): void
gump.horizontalMenuSelect(graphic: number, hue?: number): void
gump.close(): void
```

`horizontalMenuSelect` selecciona un item en el menu horizontal clasico de T2A (gump de seleccion antiguo).

### Ejemplo

```ts
player.use(someSerial);
const gump = Gump.findOrWait(0x59, 1000);
if (!gump) exit("Gump no encontrado");
if (gump.hasButton(1)) {
  gump.reply(1);
}
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

Los seriales en `ignoreList` son excluidos de los resultados de `client.findType` y metodos relacionados. Util para iterar todos los items de un tipo sin repetir.

NOTA CRITICA: La `ignoreList` persiste entre scripts (cross-script). Siempre llamar `ignoreList.clear()` al final de la iteracion para no contaminar scripts posteriores o el propio bucle principal.

`ignoreList.add()` devuelve `true` si el serial fue anadido, `false` si ya existia. `ignoreList.remove()` devuelve `true` si fue eliminado, `false` si no existia.

---

## popupMenu

```ts
popupMenu.exists: boolean
popupMenu.content: any                                           // contenido del menu si esta abierto
popupMenu.request(serial: number, waitMs?: number): boolean | undefined
popupMenu.waitUntilOpen(timeoutMs?: number): boolean
popupMenu.waitForContent(timeoutMs?: number): object | null
popupMenu.reply(index: number): void
popupMenu.close(): void
```

`reply(0)` selecciona la primera opcion del menu. Los indices son 0-based.

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
worldMap.addMarker(marker: Partial<WorldMapMarker>): WorldMapMarker
worldMap.removeMarker(marker: string | WorldMapMarker): boolean
worldMap.removeAllMarkers(): void
worldMap.parseLocation(input: string): object | undefined
```

`parseLocation` soporta coordenadas sextante. Ejemplo de formato: `"100o25'S,40o04'E"`.

### WorldMapMarker — interfaz

```ts
interface WorldMapMarker {
  name: string;
  color: string;      // nombre de color, ej: "green", "blue"
  x: number;
  y: number;
  mapId: number;      // indice del mapa
  zoomLevel: number;  // nivel de zoom minimo para mostrar el marcador
}
```

`WorldMapMarkerPartial` permite `color`, `mapId` y `zoomLevel` como opcionales; `name`, `x`, `y` son obligatorios.

---

## Enumeraciones

### Abilities

```
None=0, ArmorIgnore=1, BleedAttack=2, ConcussionBlow=3, CrushingBlow=4,
Disarm=5, Dismount=6, DoubleStrike=7, InfectiousStrike=8, MortalStrike=9,
MovingShot=10, ParalyzingBlow=11, ShadowStrike=12, WhirlwindAttack=13,
RidingSwipe=14, FrenziedWhirlwind=15, Block=16, DefenseMastery=17,
NerveStrike=18, TalonStrike=19, Feint=20, DualWield=21, DoubleShot=22,
ArmorPierce=23, Bladeweave=24, ForceArrow=25, LightningArrow=26,
PsychicAttack=27, SerpentArrow=28, ForceOfNature=29, InfusedThrow=30,
MysticArc=31, Invalid=255
```

### BuffDebuffs (seleccion de valores mas usados)

```
DismountPrevention=1001, NoRearm=1002, NightSight=1005, DeathStrike=1006,
EvilOmen=1007, HonoredDebuff=1008, AchievePerfection=1009, DivineFury=1010,
EnemyOfOne=1011, HidingAndOrStealth=1012, ActiveMeditation=1013,
BloodOathCaster=1014, BloodOathCurse=1015, CorpseSkin=1016, Mindrot=1017,
PainSpike=1018, Strangle=1019, GiftOfRenewal=1020, AttuneWeapon=1021,
Thunderstorm=1022, EssenceOfWind=1023, EtherealVoyage=1024, GiftOfLife=1025,
ArcaneEmpowerment=1026, MortalStrike=1027, ReactiveArmor=1028,
Protection=1029, ArchProtection=1030, MagicReflection=1031, Incognito=1032,
Disguised=1033, AnimalForm=1034, Polymorph=1035, Invisibility=1036,
Paralyze=1037, Poison=1038, Bleed=1039, Clumsy=1040, FeebleMind=1041,
Weaken=1042, Curse=1043, MassCurse=1044, Agility=1045, Cunning=1046,
Strength=1047, Bless=1048, Sleep=1049, StoneForm=1050, SpellPlague=1051,
Berserk=1052, MassSleep=1053, Fly=1054, Inspire=1055, Invigorate=1056,
Resilience=1057, Perseverance=1058, TribulationTarget=1059,
DespairTarget=1060, HitLowerAttack=1063, HitLowerDefense=1064,
DualWield=1065, Block=1066, DefenseMastery=1067, DespairCaster=1068,
Healing=1069, SpellFocusingBuff=1070, SpellFocusingDebuff=1071,
RageFocusingDebuff=1072, RageFocusingBuff=1073, Warding=1074,
TribulationCaster=1075, ForceArrow=1076, Disarm=1077, Surge=1078,
Feint=1079, TalonStrike=1080, PsychicAttack=1081, ConsecrateWeapon=1082,
GrapesOfWrath=1083, EnemyOfOneDebuff=1084, HorrificBeast=1085,
LichForm=1086, VampiricEmbrace=1087, CurseWeapon=1088, ReaperForm=1089,
ImmolatingWeapon=1090, Enchant=1091, HonorableExecution=1092,
Confidence=1093, Evasion=1094, CounterAttack=1095, LightningStrike=1096,
MomentumStrike=1097, OrangePetals=1098, RoseOfTrinsic=1099,
PoisonImmunity=1100, Veterinary=1101, Perfection=1102, Honored=1103,
ManaPhase=1104, FanDancerFanFire=1105, Rage=1106, Webbing=1107,
MedusaStone=1108, TrueFear=1109, AuraOfNausea=1110, HowlOfCacophony=1111,
GazeDespair=1112, HiryuPhysicalResistance=1113, RuneBeetleCorruption=1114,
BloodwormAnemia=1115, RotwormBloodDisease=1116, SkillUseDelay=1117,
FactionStatLoss=1118, HeatOfBattleStatus=1119, CriminalStatus=1120,
ArmorPierce=1121, SplinteringEffect=1122, SwingSpeedDebuff=1123,
WraithForm=1124, CityTradeDeal=1126, HumilityDebuff=1127,
Spirituality=1128, Humility=1129, Rampage=1130, Stagger=1131,
Toughness=1132, Thrust=1133, Pierce=1134, PlayingTheOdds=1135,
FocusedEye=1136, Onslaught=1137, ElementalFury=1138, ElementalFuryDebuff=1139,
CalledShot=1140, Knockout=1141, SavingThrow=1142, Conduit=1143,
EtherealBurst=1144, MysticWeapon=1145, ManaShield=1146, AnticipateHit=1147,
Warcry=1148, Shadow=1149, WhiteTigerForm=1150, Bodyguard=1151,
HeightenedSenses=1152, Tolerance=1153, DeathRay=1154, DeathRayDebuff=1155,
Intuition=1156, EnchantedSummoning=1157, ShieldBash=1158, Whispering=1159,
CombatTraining=1160, InjectedStrikeDebuff=1161, InjectedStrike=1162,
UnknownTomato=1163, PlayingTheOddsDebuff=1164, DragonTurtleDebuff=1165,
Boarding=1166, Potency=1167, ThrustDebuff=1168, FistsOfFury=1169,
BarrabHemolymphConcentrate=1170, JukariBurnPoiltice=1171,
KurakAmbushersEssence=1172, BarakoDraftOfMight=1173, UraliTranceTonic=1174,
SakkhraProphylaxis=1175, Sparks=1176, Swarm=1177, BoneBreaker=1178,
Unknown2=1179, SwarmImmune=1180, BoneBreakerImmune=1181,
UnknownGoblin=1182, UnknownRedDrop=1183, UnknownStar=1184,
FeintDebuff=1185, CaddelliteInfused=1186, PotionGloriousFortune=1187,
MysticalPolymorphTotem=1188, UnknownDebuff=1189
```

### Constant

```
WorldSerial=4294967295
```

Usar `Constant.WorldSerial` como `serial` en `client.headMsg` muestra el mensaje sin asociarlo a ninguna entidad.

### Directions

```
North=0, Right=1, East=2, Down=3, South=4, Left=5, West=6, Up=7
```

### Layers

```
Invalid=0, OneHanded=1, TwoHanded=2, Shoes=3, Pants=4, Shirt=5, Helmet=6,
Gloves=7, Ring=8, Talisman=9, Necklace=10, Hair=11, Waist=12, Torso=13,
Bracelet=14, Face=15, Beard=16, Tunic=17, Earrings=18, Arms=19, Cloak=20,
Backpack=21, Robe=22, Skirt=23, Legs=24, Mount=25, ShopBuyRestock=26,
ShopBuy=27, ShopSell=28, Bank=29
```

### MessageType

```
Regular=0, System=1, Emote=2, Limit3Spell=3, Label=6, Focus=7, Whisper=8,
Yell=9, Spell=10, Guild=13, Alliance=14, Command=15, Encoded=192,
UOChat=254, Party=255
```

### Notorieties

```
Unknown=0, Innocent=1, Ally=2, Gray=3, Criminal=4, Enemy=5, Murderer=6, Invulnerable=7
```

### SearchEntityOptions (flags combinables con |)

```
Any=1, Enemy=2, Murderer=4, Criminal=8, Gray=16, Innocent=32, Unfriendly=64, Friend=128, Invulnerable=256
```

### SearchEntityRangeOptions

```
Next=0, Previous=1, Nearest=2, Closest=3
```

### SearchEntityTypeOptions

```
Any=0, Human=1, NonHuman=2
```

### SkillLock

```
Up=0, Down=1, Locked=2
```

### Skills (58 habilidades)

```
Alchemy=0, Anatomy=1, AnimalLore=2, ItemID=3, ArmsLore=4, Parry=5,
Begging=6, Blacksmith=7, Fletching=8, Peacemaking=9, Camping=10,
Carpentry=11, Cartography=12, Cooking=13, DetectHidden=14, Discordance=15,
EvalInt=16, Healing=17, Fishing=18, Forensics=19, Herding=20, Hiding=21,
Provocation=22, Inscribe=23, Lockpicking=24, Magery=25, MagicResist=26,
Tactics=27, Snooping=28, Musicianship=29, Poisoning=30, Archery=31,
SpiritSpeak=32, Stealing=33, Tailoring=34, AnimalTaming=35, TasteID=36,
Tinkering=37, Tracking=38, Veterinary=39, Swords=40, Macing=41,
Fencing=42, Wrestling=43, Lumberjacking=44, Mining=45, Meditation=46,
Stealth=47, RemoveTrap=48, Necromancy=49, Focus=50, Chivalry=51,
Bushido=52, Ninjitsu=53, Spellweaving=54, Mysticism=55, Imbuing=56,
Throwing=57
```

### Spells

Magia (1-64):
```
Clumsy=1, CreateFood=2, Feeblemind=3, Heal=4, MagicArrow=5, NightSight=6,
ReactiveArmor=7, Weaken=8, Agility=9, Cunning=10, Cure=11, Harm=12,
MagicTrap=13, RemoveTrap=14, Protection=15, Strength=16, Bless=17,
Fireball=18, MagicLock=19, Poison=20, Telekinesis=21, Teleport=22,
Unlock=23, WallOfStone=24, ArchCure=25, ArchProtection=26, Curse=27,
FireField=28, GreaterHeal=29, Lightning=30, ManaDrain=31, Recall=32,
BladeSpirits=33, DispelField=34, Incognito=35, MagicReflect=36,
MindBlast=37, Paralyze=38, PoisonField=39, SummonCreature=40, Dispel=41,
EnergyBolt=42, Explosion=43, Invisibility=44, Mark=45, MassCurse=46,
ParalyzeField=47, Reveal=48, ChainLightning=49, EnergyField=50,
FlameStrike=51, GateTravel=52, ManaVampire=53, MassDispel=54,
MeteorSwarm=55, Polymorph=56, Earthquake=57, EnergyVortex=58,
Resurrection=59, AirElemental=60, SummonDaemon=61, EarthElemental=62,
FireElemental=63, WaterElemental=64
```

Necromancia (101-117):
```
AnimateDead=101, BloodOath=102, CorpseSkin=103, CurseWeapon=104,
EvilOmen=105, HorrificBeast=106, LichForm=107, MindRot=108, PainSpike=109,
PoisonStrike=110, Strangle=111, SummonFamiliar=112, VampiricEmbrace=113,
VengefulSpirit=114, Wither=115, WraithForm=116, Exorcism=117
```

Paladinismo (201-210):
```
CleanseByFire=201, CloseWounds=202, ConsecrateWeapon=203, DispelEvil=204,
DivineFury=205, EnemyOfOne=206, HolyLight=207, NobleSacrifice=208,
RemoveCurse=209, SacredJourney=210
```

Bushido (401-406):
```
HonorableExecution=401, Confidence=402, Evasion=403, CounterAttack=404,
LightningStrike=405, MomentumStrike=406
```

Ninjitsu (501-508):
```
FocusAttack=501, DeathStrike=502, AnimalForm=503, KiAttack=504,
SurpriseAttack=505, Backstab=506, Shadowjump=507, MirrorImage=508
```

Spellweaving (601-616):
```
ArcaneCircle=601, GiftOfRenewal=602, ImmolatingWeapon=603, Attunement=604,
Thunderstorm=605, NaturesFury=606, SummonFey=607, SummonFiend=608,
ReaperForm=609, Wildfire=610, EssenceOfWind=611, DryadAllure=612,
EtherealVoyage=613, WordOfDeath=614, GiftOfLife=615, ArcaneEmpowerment=616
```

Mysticism (678-693):
```
NetherBolt=678, HealingStone=679, PurgeMagic=680, Enchant=681, Sleep=682,
EagleStrike=683, AnimatedWeapon=684, StoneForm=685, SpellTrigger=686,
MassSleep=687, CleansingWinds=688, Bombard=689, SpellPlague=690,
HailStorm=691, NetherCyclone=692, RisingColossus=693
```

Mastery y otros (700+):
```
Inspire=701, Invigorate=702, Resilience=703, Perseverance=704,
Tribulation=705, Despair=706, DeathRay=707, EtherealBurst=708,
NetherBlast=709, MysticWeapon=710, CommandUndead=711, Conduit=712,
ManaShield=713, SummonReaper=714, EnchantedSummoning=715, AnticipateHit=716,
Warcry=717, Intuition=718, Rejuvenate=719, HolyFist=720, Shadow=721,
WhiteTigerForm=722, FlamingShot=723, PlayingTheOdds=724, Thrust=725,
Pierce=726, Stagger=727, Toughness=728, Onslaught=729, FocusedEye=730,
ElementalFury=731, CalledShot=732, WarriorsGifts=733, ShieldBash=734,
Bodyguard=735, HeightenSenses=736, Tolerance=737, InjectedStrike=738,
Potency=739, Rampage=740, FistsOfFury=741, Knockout=742, Whispering=743,
CombatTraining=744, Boarding=745
```

### Virtues

```
Honor=1, Sacrifice=2, Valor=3
```

---

## Patrones comunes

### Bucle principal con sleep correcto

```ts
while (true) {
  if (player.hits < player.maxHits && !player.isPoisoned) {
    // logica de accion
  } else {
    sleep(500);  // OBLIGATORIO: evita tormenta de paquetes cuando no hay trabajo
  }
}
```

Si la condicion es verdadera y la accion falla sin incluir sleep, el bucle puede ejecutarse cientos de veces por segundo generando una cantidad masiva de paquetes al servidor.

### Iterar todos los items de un tipo

```ts
ignoreList.clear();
let item: Item | Mobile | null;
while ((item = client.findType(0xeed))) {
  log(`Serial: ${item.serial}`);
  ignoreList.add(item);
}
ignoreList.clear();
```

### Usar vendajes

```ts
const bandages = client.findType(0xe21);
if (bandages) {
  player.use(bandages);
  target.waitTargetSelf();
}
```

### Abrir gump y responder

```ts
player.use(someSerial);
const gump = Gump.findOrWait(0x59, 1000);
if (!gump) exit("Gump no encontrado");
if (gump.hasButton(1)) {
  gump.reply(1);
}
```

### Comprar en un vendedor

```ts
player.say('vendor buy');
const data = Gump.lastVendorBuyData;
if (data) {
  const ingots = data.items.filter((i: any) => i.name.toLowerCase().includes('ingot'));
  client.sendBuyRequest(data.vendor, ingots);
}
```

### Buscar entidad enemiga cercana

```ts
const enemy = client.selectEntity(
  SearchEntityOptions.Enemy | SearchEntityOptions.Murderer,
  SearchEntityRangeOptions.Nearest,
  SearchEntityTypeOptions.Any,
  false
);
if (enemy) {
  player.attack(enemy);
}
```

### Comprobar y cambiar lock de skill

```ts
const medSkill = player.getSkill(Skills.Meditation);
if (medSkill && medSkill.lock !== SkillLock.Up) {
  player.setSkillLock(Skills.Meditation, SkillLock.Up);
}
// Valor real: medSkill.value / 10 (ej: 746 -> 74.6)
```

---

## Errores frecuentes

| Incorrecto                        | Correcto                              | Razon                                    |
|-----------------------------------|---------------------------------------|------------------------------------------|
| `player.dex`                      | `player.dexterity`                    | nombre de propiedad completo             |
| `player.str`                      | `player.strength`                     | nombre de propiedad completo             |
| `player.int`                      | `player.intelligence`                 | nombre de propiedad completo             |
| `client.isPoisoned()`             | `player.isPoisoned`                   | propiedad booleana de player/mobile      |
| `target.waitTarget()`             | `target.wait()`                       | nombre de metodo correcto                |
| `target.setTargetToSelf()`        | `target.self()`                       | nombre de metodo correcto                |
| `Math.round(secs)` en countdown   | `Math.floor(secs)`                    | evita valores negativos en el resto      |
| Bucle sin sleep en rama de fallo  | `sleep(2000)` tras fallo              | evita tormenta de paquetes bajo lag      |
| `!!valor` siendo `valor` boolean  | `valor` directamente                  | la doble negacion es redundante          |
| `player.getSkill(...).value` como decimal | `player.getSkill(...).value / 10` | el valor se devuelve como entero * 10 |
| `Gump.findOrWait` sin timeout explícito | `Gump.findOrWait(serial, 1000)` | el timeout por defecto es 5000 ms, puede ser excesivo |
| Leer `journal` en PvP activo sin `clear()` previo | `journal.clear()` antes de la accion | el journal acumula mensajes anteriores |
