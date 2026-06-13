# colores_importantes_ua.md

Referencia de hues (colores) relevantes para scripting en **Ultima Alianza**.

El hue se pasa como segundo argumento en `client.findType(graphic, hue)` y se lee con `item.hue`. Ver sección 13 de best-practices para el patrón de uso.

---

## ORES — Metales, lingotes y armaduras

El hue de un ore es el mismo que el de su lingote fundido y el de las piezas de armadura fabricadas con ese metal.

```ts
// Buscar lingote de Sombra en la mochila
client.findType(0x1BEF, 0x0770, player.backpack);
// Buscar coraza de Valorite
client.findType(0x1415, 0x0515, player.backpack);
```

| Metal | Hex | Dec | DEFNAME |
|-------|-----|-----|---------|
| Hierro | `0x0000` | 0 | color_o_iron |
| Bronce | `0x06D6` | 1750 | color_o_bronze |
| Oro | `0x045E` | 1118 | color_o_gold |
| Cobre | `0x0641` | 1601 | color_o_copper |
| Cobre Viejo | `0x0590` | 1424 | color_o_oldcopper |
| Cobre Mate | `0x060A` | 1546 | color_o_dullcopper |
| Plata | `0x0482` | 1154 | color_o_silver |
| Sombra | `0x0770` | 1904 | color_o_shadow |
| Roca de Sangre | `0x04C2` | 1218 | color_o_bloodrock |
| Roca Negra | `0x0455` | 1109 | color_o_blackrock |
| Mytheril | `0x052D` | 1325 | color_o_mytheril |
| Rosa | `0x0665` | 1637 | color_o_rose |
| Verite | `0x07D1` | 2001 | color_o_verite |
| Agapite | `0x0400` | 1024 | color_o_agapite |
| Oxidado | `0x0750` | 1872 | color_o_rusty |
| Valorite | `0x0515` | 1301 | color_o_valorite |
| Acero | `0x0385` | 901 | color_o_acero |
| Aqua | `0x000A` | 10 | color_o_aqua |
| Ácido | `0x0787` | 1927 | color_o_acido |
| Cristalino | `0x0065` | 101 | color_o_cristalino |
| Volcán | `0x0785` | 1925 | color_o_volcan |
| Nieve | `0x0481` | 1153 | color_o_nieve |
| Lunar | `0x0035` | 53 | color_o_lunar |
| Kriptonita | `0x0786` | 1926 | color_o_kriptonita |
| Hielo | `0x0480` | 1152 | color_o_hielo |
| Litio | `0x026E` | 622 | color_o_litium |
| Adamantium | `0x027?` | ? | color_o_adamantium |
| Dragón | `0x0795` | 1941 | color_o_dragon |
| Titan | `0x0798` | 1944 | color_o_titan |
| Sky | `0x005B` | 91 | color_o_sky |
| Eclipse | `0x07A1` | 1953 | color_o_eclipse |
| Titanio | `0x043C` | 1084 | color_o_titanio |
| Solaris | `0x0B99` | 2969 | color_o_Solaris |
| Sub-Oscuridad | `0x07B5` | 1973 | color_o_suboscuridad |
| Iridio | `0x07CB` | 1995 | color_o_iridio |
| Obsidiana | `0x04E7` | 1255 | color_o_obsidiana |
| Teñible | `0x02AE` | 686 | color_o_tintable |

> `color_o_adamantium` tiene el valor `027l` en el script fuente — la `l` no es un dígito hex válido. Revisar en defs_ua.scp.

---

## SLAYERS — Armas con daño extra a criaturas

*(pendiente)*

---

## TUB — Colores de temporada (tintes de ropa)

Tintes de ediciones limitadas. Cada letra corresponde a una temporada de UA.

*(pendiente — tub_b1, tub_b2, etc.)*
