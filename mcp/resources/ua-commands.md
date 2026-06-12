# Ultima Alianza — Comandos del servidor

Referencia de comandos específicos del servidor Ultima Alianza para uso en macros del cliente web ClassicUO.
Fuente: wiki oficial de Ultima Alianza.
Fecha: 2026-06-12

Todos los comandos se ejecutan mediante `player.say('comando')` desde un macro.
Los parámetros se indican entre `< >`. Los comandos sin parámetro se usan tal cual.

## Tipos de comando

Existen dos tipos, ambos usan `player.say()` pero con comportamiento distinto:

### Comandos de servidor (punto)

Empiezan por `.` (punto). El servidor los intercepta y ejecuta la acción sin que el personaje hable en pantalla. No son visibles para otros jugadores como discurso. Funcionan desde cualquier lugar sin necesidad de proximidad a un objetivo.

```ts
player.say('.vendas');      // el personaje NO dice nada en voz alta
player.say('.cast 43');     // el servidor lanza el hechizo 43
player.say('.vida');        // el servidor usa la poción de vida
```

### Comandos de voz

Sin punto. El personaje los dice en voz alta en el juego — aparecen como globo de diálogo y son visibles para otros jugadores cercanos. Requieren proximidad al objetivo (mascota, NPC, barco) para que surtan efecto.

```ts
player.say('All kill');     // el personaje grita "All kill", las mascotas responden
player.say('Bank');         // dicho al lado de un banquero, abre el banco
player.say('Hola');         // dicho al lado de un NPC, inicia conversación
player.say('Forward');      // dicho en un barco, lo mueve hacia adelante
```

---

## Generales — comandos de servidor

| Comando | Descripción |
|---------|-------------|
| `.perfil` | Información completa del personaje |
| `.where` | Muestra la localización actual y nombre de la zona |
| `.res` | Evita esperar los 10 segundos para ser resucitado |
| `.regs` | Muestra una ventana con los reactivos que llevamos encima |
| `.desarmarse` | Desarma las dos manos |
| `.vendas` | Usa las vendas disponibles en la mochila |
| `.aviso_venda on` / `.aviso_venda off` | Activa/desactiva el aviso de venda disponible tras curación |
| `.aviso_pocion on` / `.aviso_pocion off` | Activa/desactiva el aviso de poción disponible tras efecto |
| `.aviso_combate` | Muestra encima de la cabeza el daño recibido por golpe |
| `.aturdir` | Requiere 80.01 anatomía y 80.01 boxeo; cada golpe consume 15 energía y paraliza 5s. Incompatible con `.desarmar` |
| `.desarmar` | Requiere 80.01 conocimiento de armas y 80.01 boxeo; cada golpe consume 15 energía y desarma. Incompatible con `.aturdir` |
| `.entrenamiento on` / `.entrenamiento off` | on: karma negativo para que cualquiera pueda atacarte. off: en 60s se congela para recuperar karma |
| `.masoquismo on` / `.masoquismo off` | on: no puedes atacar ni devolver golpes. off: estado normal |
| `.perdonar` | Perdona a todos los que te hayan golpeado, evitando que se hagan criminales |
| `.logout_seguro` | Muestra el tiempo restante de no-seguro |
| `.suicide` | Muere en el acto |
| `.tiempo_muerte` | Muestra el tiempo que falta para bajar una muerte |
| `.crear_cheque <cantidad>` | Convierte oro de la mochila en cheque (se deshace con un clic) |
| `.restaurar_color` | Devuelve el color original a una montura |
| `.clave` | Abre ventana para cambiar la contraseña |
| `.recordar_email` | Ver el mail asociado a la cuenta |
| `.poner_email *<contraseña>*` | Añade un correo si no existe uno previo |
| `.items_banco` | Informa del número de objetos en el banco (máximo 125) |
| `.tele` | Lanza el hechizo Teleport (requiere regs y pergamino en libro, no la skill) |
| `.resend` | Recarga los objetos de la pantalla |
| `.chat` | Activa/desactiva y cambia color de chats de facción y clan |
| `.clan <mensaje>` | Habla con los miembros del clan |
| `.faccion <mensaje>` | Habla con los miembros de la facción |
| `.equipo <mensaje>` | Habla con los miembros del equipo en GC o CB |
| `.bloquear_stats` | Bloquea los atributos para evitar variaciones |
| `.hungry` | Informa sobre los niveles de comida |
| `.disparo_movimiento on` / `.disparo_movimiento off` | Requiere montura y 90 tiro con arco; disparos en movimiento con coste de energía |
| `.guardar_uid <1-4>` | Memoriza la UID de la casilla indicada (1 y 2 permanentes, 3 y 4 temporales) |
| `.usar_uid <1-4>` | Usa la UID memorizada en la casilla indicada |
| `.guardar_type <1-4>` | Memoriza el TYPE de la casilla indicada (1 y 2 permanentes, 3 y 4 temporales) |
| `.usar_type <1-4>` | Usa el TYPE memorizado en la casilla indicada |
| `.detectar` | Activa/desactiva la detección pasiva de lo oculto |
| `.espiritualidad` | Alterna "Contactar con el infierno" (potencia hechizos de nigromante) y "Absorver Cuerpos" (cura con gasto de mana) |
| `.espiritualidad espiritu` | Absorve el cuerpo más cercano o resta mana para curar |
| `.reputaciones` | Muestra la reputación racial y su tipo |
| `.honor` | Reta al enemigo seleccionado para ascender en la virtud de honor |
| `.resignar` | Sale del clan actual o deja de ser candidato |
| `.renunciar` | Abandona una misión en curso |
| `.torneo` | Accede a eventos del staff (1vs1, 2vs2, bomberman, etc.) |
| `.gc` | Accede a la Guerra de Colores si la inscripción está abierta |
| `.cb` | Accede a Capturar Bandera si la inscripción está abierta |
| `.cataloga_tub` | Obtiene información sobre el grupo del tinte actual |
| `.baston` | Invoca el poder de un bastón fabricado con BOD de inscripción |
| `.bug_nomovil` | Reporta la posición de un objeto inamovible |
| `.HelpPage` | Abre la ventana de soporte (page, sala de ayuda, etc.) |
| `.infogolem` | Muestra la información del golem propio |
| `.familiar` | Invoca al familiar al lado si su vida es mayor al 25% (consume 1 vial de sangre de dragón) |
| `.masoquismofamiliar` | El familiar no obedece órdenes de kill ni devuelve golpes |

---

## Pociones — comandos de servidor

Las pociones se usan mediante `player.say('.comando')`. Existen tres niveles: menor, normal y mejorada.

### Recuperación de stats

| Stat | Menor | Normal | Mejorada |
|------|-------|--------|----------|
| Vida | `.vidamenor` | `.vida` | `.vidamejorada` |
| Estamina | — | `.energia` | `.energiamejorada` |
| Mana | — | `.mananormal` | `.manamejorada` |

### Bonificación de stats

| Stat | Menor | Normal | Mejorada |
|------|-------|--------|----------|
| Fuerza | — | `.fuerza` | `.fuerzamejorada` |
| Destreza | — | `.agilidad` | `.agilidadmejorada` |
| Inteligencia | — | `.inteligencia` | `.inteligenciamejorada` |

### Otras pociones

| Comando | Descripción |
|---------|-------------|
| `.antidotomenor` / `.antidoto` / `.antidotomejorada` | Antídoto de veneno |
| `.explosionmenor` / `.explosion` / `.explosionmejorada` | Poción de explosión |
| `.bendecir` | Poción de bendición |
| `.armadurareactiva` | Poción de armadura reactiva |
| `.cambiosexo` | Poción de cambio de sexo |

---

## Hechizos — comandos de servidor

### Mago

Lanzar desde el libro de magia: `player.say('.cast <N>')`
Lanzar desde pergamino: `player.say('.p<N>')`

| N | Hechizo | N | Hechizo | N | Hechizo | N | Hechizo |
|---|---------|---|---------|---|---------|---|---------|
| 01 | Clumsiness | 17 | Bless | 33 | Blade Spirits | 49 | Chain Lightning |
| 02 | Create Food | 18 | Fireball | 34 | Dispel Field | 50 | Energy Field |
| 03 | Feeblemind | 19 | Magic Lock | 35 | Incognito | 51 | Flamestrike |
| 04 | Heal | 20 | Poison | 36 | Magic Reflection | 52 | Gate Travel |
| 05 | Magic Arrow | 21 | Telekinesis | 37 | Mind Blast | 53 | Mana Vampire |
| 06 | Night Vision | 22 | Teleport | 38 | Paralyze | 54 | Mass Dispel |
| 07 | Reactive Armor | 23 | Unlock | 39 | Poison Field | 55 | Meteor Swarm |
| 08 | Weaken | 24 | Wall of Stone | 40 | Summon Creature | 56 | Polymorph |
| 09 | Agility | 25 | Archcure | 41 | Dispel | 57 | Earthquake |
| 10 | Cunning | 26 | Archprotection | 42 | Energy Bolt | 58 | Energy Vortex |
| 11 | Cure | 27 | Curse | 43 | Explosion | 59 | Resurrection |
| 12 | Harm | 28 | Fire Field | 44 | Invisibility | 60 | Summon Air Elemental |
| 13 | Magic Trap | 29 | Greater Heal | 45 | Mark | 61 | Summon Daemon |
| 14 | Magic Untrap | 30 | Lightning | 46 | Mass Curse | 62 | Summon Earth Elemental |
| 15 | Protection | 31 | Mana Drain | 47 | Paralyze Field | 63 | Summon Fire Elemental |
| 16 | Strength | 32 | Recall | 48 | Reveal | 64 | Summon Water Elemental |

### Nigromante

`player.say('.nigro <N>')`

| N | Hechizo | N | Hechizo |
|---|---------|---|---------|
| 01 | Ataque de veneno | 11 | Forma de liche |
| 02 | Marchitar | 12 | Abrazo vampírico |
| 03 | Punta de dolor | 13 | Bestia horrenda |
| 04 | Maldecir arma | 14 | Animar a los muertos |
| 05 | Juramento de sangre | 15 | Espíritu vengativo |
| 06 | Presagio malvado | 16 | Convocar muerto |
| 07 | Putrefacción mental | 17 | Controlar muerto |
| 08 | Estrangular | 18 | Maldición de la edad |
| 09 | Piel de cadáver | 19 | Fuego del averno |
| 10 | Forma de espectro | 20 | Pentagrama |

### Bardo

`player.say('.cancion<N>')`

| N | Canción | N | Canción |
|---|---------|---|---------|
| 1 | Descanso | 11 | Pies pesados |
| 2 | Recuperación | 12 | Himno de batalla |
| 3 | Concentración | 13 | Desmayo |
| 4 | Sabiduría | 14 | Oscuridad |
| 5 | Rudeza | 15 | Labor |
| 6 | Presteza | 16 | Los muertos |
| 7 | Motivación | 17 | Confusión |
| 8 | Frenesí | 18 | Tranquilidad |
| 9 | Cuna | 19 | Elemental |
| 10 | Vida | 20 | Ocultación |

### Bardo élfico

`player.say('.cancion<N>')` (continuación del libro élfico)

| N | Canción | N | Canción |
|---|---------|---|---------|
| 21 | Voz élfica | 26 | Amigo elfo |
| 22 | Llamada familiar | 27 | Curandero |
| 23 | Dragón dorado | 28 | Capitán Noldor |
| 24 | Viaje élfico | 29 | Luz élfica |
| 25 | A los ents | 30 | Campamento |

### Paladín

`player.say('.caballeria<N>')`

| N | Habilidad | N | Habilidad |
|---|-----------|---|-----------|
| 01 | Purificar con fuego | 06 | Consagrar alma |
| 02 | Cerrar heridas | 07 | Quitar maldición |
| 03 | Viaje sagrado | 08 | Enemigo de uno |
| 04 | Disipar el mal | 09 | Luz sagrada |
| 05 | Furia divina | 10 | Sacrificio noble |

---

## Armas legendarias — comandos de servidor

| Comando | Efecto |
|---------|--------|
| `.PortadoraTormentas` | Invoca Vórtice de tormenta |
| `.ProtectoraDeber` | Invoca Araña de fase |
| `.GuardianaDelHonor` | Invoca Hada |
| `.LanzaSangre` | Invoca varios esqueletos de sangre |
| `.LanzaSangre_Vida` | Drena vida con cada golpe |
| `.LanzaSangre_Energia` | Drena energía con cada golpe |
| `.LanzaSangre_Mana` | Drena mana con cada golpe |
| `.equilibrio_maligno` | Invoca Wisp maligno |
| `.equilibrio_sagrado` | Invoca Wisp sagrado |
| `.equilibrio_neutral` | Invoca Wisp neutral |

---

## NPCs — comandos de voz

Comandos hablados cerca de un NPC mediante `player.say('comando')`.

| Comando | Descripción |
|---------|-------------|
| `Hola` | Inicia la conversación con el NPC |
| `Adios` | Termina la conversación |
| `Comprar` | Abre el menú de compra |
| `Vender` | Abre el menú de venta |
| `Bank` | Abre el banco |
| `Bank balance` | Calcula el dinero total del personaje (mochila + banco, sin casa ni cheques) |
| `Train` | El NPC indica qué habilidades puede enseñar |
| `Train <skill>` | Calcula el coste para entrenar la skill indicada (nombre en inglés) |

---

## Vendors — comandos de voz

Comandos hablados al vendor propio.

| Comando | Descripción |
|---------|-------------|
| `Precio <cantidad>` | Pone precio a un objeto (target) |
| `Precioc <cantidad>` | Pone precio a todos los objetos de un contenedor (target) |
| `Bolsa` | Añade al vendor una bolsa completa |
| `Tratado` | Realiza un trueque (primero objeto ofrecido, luego objeto pedido, con cantidades) |
| `Descripcion` | Pone descripción a un contenedor |
| `Informacion` | Muestra objetos en venta, dinero ganado y dinero de alquiler |
| `Personalizar` | Cambia apariencia del vendor y lo viste con objetos de la mochila |
| `Oro` / `Caja` / `Ganancias` | Recibe el oro obtenido de las ventas |
| `Pagar` | Abre diálogo para pagar el alquiler |
| `Copropietario` | Añade hasta dos personajes con acceso a añadir/retirar objetos y cobrar |
| `Quitar Copropietario 1` / `Quitar Copropietario 2` | Elimina un copropietario |
| `Cerrar` | Cierra la venta al público |
| `Abrir` | Reabre la venta al público |
| `Despedir` | Elimina al vendor, dejando una escritura de empleo |

---

## Golems — comandos de voz

Comandos hablados al golem o mediante `.infogolem`.

| Comando | Descripción |
|---------|-------------|
| `.infogolem` | Muestra la información del golem |
| `Golem Repararse` / `<nombre> Repararse` | El golem empieza a curarse |
| `Golem Reducir` / `<nombre> Reducir` | Lo encoge en la mochila (consume 1 poción de encoger) |
| `Golem Desarmar` / `<nombre> Desarmar` | Quita las armas y las pone en la mochila |
| `Golem Soltar armadura` / `<nombre> Soltar armadura` | Quita la armadura y la pone en la mochila |
| `Golem Color` / `<nombre> Color` | Devuelve el color de fabricación |
| `Golem Manillas` / `<nombre> Manillas` | Abre diálogo para insertar manillas |
| `Golem Flechas` / `<nombre> Flechas` | Abre diálogo para insertar flechas |
| `Golem Drop` / `<nombre> Drop` | Suelta engranajes y flechas al suelo (no armas) |

---

## Mascotas y familiares — comandos de voz (y dos de servidor)

Comandos hablados cerca de la mascota: `All <orden>` (todas las mascotas) o `<nombre> <orden>` (mascota específica).
Los comandos `.familiar` y `.masoquismofamiliar` son comandos de servidor (llevan punto) y no requieren proximidad.

| Comando | Descripción |
|---------|-------------|
| `All stay` / `<nombre> stay` | Se detiene en su posición |
| `All stop` / `<nombre> stop` | Cancela la acción en curso y se detiene |
| `All come` / `<nombre> come` | Sigue al jugador |
| `All follow` / `<nombre> follow` | Sigue a quien se seleccione |
| `All follow me` / `<nombre> follow me` | Sigue al jugador |
| `All go` / `<nombre> go` | Va a donde se seleccione |
| `All guard` / `<nombre> guard` | Protege a quien se seleccione |
| `All guard me` / `<nombre> guard me` | Defiende al jugador de quien le ataque |
| `All kill` / `<nombre> kill` | Ataca a quien se seleccione |
| `All drop` / `<nombre> drop` | Tira al suelo los objetos guardados |
| `All transfer` / `<nombre> transfer` | Para intercambiar la mascota con otro personaje |
| `karma` | Dicho al familiar, informa su nivel de karma |
| `donde` | Dicho al familiar, informa la localización de ambos |
| `comida` | Dicho al familiar, informa su nivel de comida |
| `magia` / `fuerza` / `destreza` / `inteligencia` | Dicho al familiar, informa su nivel de la stat indicada |
| `resist` / `tactic` / `veneno` / `eval` / `detec` / `habilidad` | Dicho al familiar, informa su nivel de la skill indicada |
| `vuelve a mi familiar` | Resucita al familiar si está muerto (consume 3 viales de sangre de dragón) |
| `rehuso de ti familiar` | Abandona al familiar, haciéndolo desaparecer |
| `.familiar` | Invoca al familiar al lado si su vida supera el 25% (consume 1 vial de sangre de dragón) |
| `.masoquismofamiliar` | El familiar no obedece órdenes de kill ni devuelve golpes |

---

## Barcos — comandos de voz

Comandos hablados en el barco.

| Comando | Descripción |
|---------|-------------|
| `Navegacion` | Abre el menú de navegación |
| `Forward` | El barco avanza |
| `Back` | El barco retrocede |
| `Left` | El barco se mueve a la izquierda |
| `Right` | El barco se mueve a la derecha |
| `Turn Left` | Gira el barco a la izquierda |
| `Turn Right` | Gira el barco a la derecha |
| `Turn Around` | Gira el barco 180° |
| `Drop Anchor` | Tira el ancla |
| `Raise Anchor` | Eleva el ancla |

---

## Casas — comandos de voz

Comandos hablados dentro de la casa propia.

| Comando | Descripción |
|---------|-------------|
| `Tiempo de decay` | Informa del tiempo restante para derrumbarse |
| `Ayuda de la casa` | Muestra el menú con todos los comandos |
| `Quiero bloquear esto` | Clava un objeto al suelo (los contenedores pueden abrirlos cualquiera) |
| `Quiero asegurar esto` | Clava el objeto y restringe el acceso por nivel (clan, amigo, co-propietario, propietario) |
| `Quiero soltar esto` | Suelta un objeto bloqueado o asegurado |
| `Elevar <0-10>` / `Subir <0-10>` | Eleva un objeto el número de unidades indicado |
| `Descender <0-10>` / `Bajar <0-10>` | Desciende un objeto el número de unidades indicado |
| `Girar` | Gira determinados objetos |
| `Deshacer` | Deshace la última acción de subir o bajar |
| `Quiero poner el Sistema de Recompensas` | Coloca un barril que canjea objetos por tickets de recompensa |
| `Quiero poner una papelera` | Coloca un barril que elimina su contenido pasados 3 minutos |
| `Quiero quitar esto` | Quita un sistema de recompensas o papelera |
