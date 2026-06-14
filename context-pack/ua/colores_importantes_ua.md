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

El color identifica el tipo de criatura al que el arma hace daño extra. Un arma con `color_dragones` inflige daño extra a dragones.

```ts
// Buscar espada matabichos de dragones en la mochila
client.findType(0x0F61, 0x0795, player.backpack);
// Comprobar tipo de slayer de un arma encontrada
const arma = client.findType(0x0F61, null, player.backpack);
if (arma && arma.hue === 0x0795) { client.headMsg('Mata dragones', player, 68); }
```

| Criatura | Hex | Dec | DEFNAME |
|----------|-----|-----|---------|
| Dragones | `0x0795` | 1941 | `color_dragones` |
| Ogros | `0x0794` | 1940 | `color_ogros` |
| Titanes | `0x0798` | 1944 | `color_titanes` |
| Lagartos | `0x0486` | 1158 | `color_lagartos` |
| Trolls | `0x07E5` | 2021 | `color_trolls` |
| Orcos | `0x079F` | 1951 | `color_orcos` |
| Elementales | `0x07C6` | 1990 | `color_elementales` |
| Demonios | `0x07C9` | 1993 | `color_demonios` |
| Mecanicos | `0x0A7E` | 2686 | `color_mecanicos` |
| Sabandijas | `0x0A98` | 2712 | `color_sabandijas` |
| Humanoides | `0x0499` | 1177 | `color_humanoides` |

---

## TUB — Colores de temporada (tintes de ropa)

Tintes de ediciones limitadas. Cada letra corresponde a una temporada de UA.

**Tub A**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_a1` | `0x0775` | 1909 |
| `tub_a2` | `0x0778` | 1912 |
| `tub_a3` | `0x077E` | 1918 |
| `tub_a4` | `0x0796` | 1942 |
| `tub_a5` | `0x0788` | 1928 |
| `tub_a6` | `0x077D` | 1917 |
| `tub_a7` | `0x077F` | 1919 |
| `tub_a8` | `0x0795` | 1941 |
| `tub_a9` | `0x0787` | 1927 |
| `tub_a10` | `0x0781` | 1921 |
| `tub_a11` | `0x0785` | 1925 |
| `tub_a12` | `0x077A` | 1914 |

**Tub B**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_b1` | `0x042A` | 1066 |
| `tub_b2` | `0x0799` | 1945 |
| `tub_b3` | `0x07CD` | 1997 |
| `tub_b4` | `0x07F4` | 2036 |
| `tub_b5` | `0x07C0` | 1984 |
| `tub_b6` | `0x048B` | 1163 |
| `tub_b7` | `0x0486` | 1158 |
| `tub_b8` | `0x0791` | 1937 |
| `tub_b9` | `0x07C2` | 1986 |
| `tub_b10` | `0x07C8` | 1992 |
| `tub_b11` | `0x044A` | 1098 |
| `tub_b12` | `0x0482` | 1154 |

**Tub C**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_c1` | `0x0443` | 1091 |
| `tub_c2` | `0x04B0` | 1200 |
| `tub_c3` | `0x07F1` | 2033 |
| `tub_c4` | `0x0437` | 1079 |
| `tub_c5` | `0x0440` | 1088 |
| `tub_c6` | `0x0432` | 1074 |
| `tub_c7` | `0x042D` | 1069 |
| `tub_c8` | `0x07EC` | 2028 |
| `tub_c9` | `0x042C` | 1068 |
| `tub_c10` | `0x04AF` | 1199 |
| `tub_c11` | `0x0442` | 1090 |
| `tub_c12` | `0x0426` | 1062 |

**Tub D**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_d1` | `0x07BC` | 1980 |
| `tub_d2` | `0x0437` | 1079 |
| `tub_d3` | `0x0425` | 1061 |
| `tub_d4` | `0x043A` | 1082 |
| `tub_d5` | `0x04A6` | 1190 |
| `tub_d6` | `0x0783` | 1923 |
| `tub_d7` | `0x0794` | 1940 |
| `tub_d8` | `0x07BE` | 1982 |
| `tub_d9` | `0x0799` | 1945 |
| `tub_d10` | `0x0429` | 1065 |
| `tub_d11` | `0x0441` | 1089 |
| `tub_d12` | `0x07C7` | 1991 |

**Tub E**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_e1` | `0x0A8E` | 2702 |
| `tub_e2` | `0x0A8D` | 2701 |
| `tub_e3` | `0x0A8C` | 2700 |
| `tub_e4` | `0x0A8B` | 2699 |
| `tub_e5` | `0x0A8F` | 2703 |
| `tub_e6` | `0x0A90` | 2704 |
| `tub_e7` | `0x0A98` | 2712 |
| `tub_e8` | `0x0A97` | 2711 |
| `tub_e9` | `0x0A3D` | 2621 |
| `tub_e10` | `0x0A7B` | 2683 |
| `tub_e11` | `0x0492` | 1170 |
| `tub_e12` | `0x0A60` | 2656 |

**Tub F**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_f1` | `0x0A4E` | 2638 |
| `tub_f2` | `0x0A71` | 2673 |
| `tub_f3` | `0x0A58` | 2648 |
| `tub_f4` | `0x0A53` | 2643 |
| `tub_f5` | `0x0A96` | 2710 |
| `tub_f6` | `0x0A1F` | 2591 |
| `tub_f7` | `0x0A2C` | 2604 |
| `tub_f8` | `0x0A78` | 2680 |

**Tub G**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_g1` | `0x0A80` | 2688 |
| `tub_g2` | `0x0A81` | 2689 |
| `tub_g3` | `0x0A82` | 2690 |
| `tub_g4` | `0x0A83` | 2691 |
| `tub_g5` | `0x0A84` | 2692 |
| `tub_g6` | `0x0A85` | 2693 |
| `tub_g7` | `0x0A86` | 2694 |
| `tub_g8` | `0x0A87` | 2695 |
| `tub_g9` | `0x0A88` | 2696 |
| `tub_g10` | `0x0A89` | 2697 |
| `tub_g11` | `0x0A8A` | 2698 |

**Tub T**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_t1` | `0x0480` | 1152 |
| `tub_t2` | `0x043A` | 1082 |
| `tub_t3` | `0x07AD` | 1965 |
| `tub_t4` | `0x07CB` | 1995 |
| `tub_t5` | `0x07CF` | 1999 |
| `tub_t6` | `0x07C6` | 1990 |
| `tub_t7` | `0x07ED` | 2029 |
| `tub_t8` | `0x0435` | 1077 |
| `tub_t9` | `0x0425` | 1061 |
| `tub_t10` | `0x07CE` | 1998 |
| `tub_t11` | `0x07F7` | 2039 |
| `tub_t12` | `0x0436` | 1078 |
| `tub_t13` | `0x0A48` | 2632 |
| `tub_t14` | `0x09F9` | 2553 |
| `tub_t15` | `0x0B99` | 2969 |
| `tub_t16` | `0x0A4C` | 2636 |
| `tub_t17` | `0x0697` | 1687 |
| `tub_t18` | `0x0A2D` | 2605 |
| `tub_t19` | `0x048C` | 1164 |
| `tub_t20` | `0x0A50` | 2640 |
| `tub_t21` | `0x0424` | 1060 |
| `tub_t22` | `0x0A14` | 2580 |
| `tub_t23` | `0x0434` | 1076 |
| `tub_t24` | `0x0446` | 1094 |

**Tub I**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_i1` | `0x0B4F` | 2895 |
| `tub_i2` | `0x0B4D` | 2893 |
| `tub_i3` | `0x0B4E` | 2894 |
| `tub_i4` | `0x0B49` | 2889 |
| `tub_i5` | `0x0B48` | 2888 |
| `tub_i6` | `0x0B47` | 2887 |
| `tub_i7` | `0x0B46` | 2886 |
| `tub_i8` | `0x0B45` | 2885 |
| `tub_i9` | `0x0B44` | 2884 |
| `tub_i10` | `0x0B43` | 2883 |
| `tub_i11` | `0x0B41` | 2881 |
| `tub_i12` | `0x0B40` | 2880 |

**Tub H**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_h1` | `0x0B5F` | 2911 |
| `tub_h2` | `0x0B5C` | 2908 |
| `tub_h3` | `0x0B57` | 2903 |
| `tub_h4` | `0x0B56` | 2902 |
| `tub_h5` | `0x0B55` | 2901 |
| `tub_h6` | `0x0B54` | 2900 |
| `tub_h7` | `0x0B53` | 2899 |
| `tub_h8` | `0x0B52` | 2898 |
| `tub_h9` | `0x0B51` | 2897 |
| `tub_h10` | `0x0B50` | 2896 |

**Tub PATRICIO**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_patricio` | `0x0A67` | 2663 |

**Tub NAVIDAD**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_navidad` | `0x07B1` | 1969 |

**Tub REVENGE**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_revenge` | `0x07C4` | 1988 |

**Tub LOVE**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_love` | `0x0481` | 1153 |

**Tub MDN**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_mdn` | `0x07C9` | 1993 |

**Tub PURE**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_pure` | `0x04EA` | 1258 |

**Tub MISTER**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_mister` | `0x07B2` | 1970 |

**Tub MISS**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_miss` | `0x04E7` | 1255 |

**Tub JHELOM**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_jhelom` | `0x07A0` | 1952 |
| `tub_jhelom2` | `0x07B5` | 1973 |

**Tub WIKI**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_wiki1` | `0x0A7F` | 2687 |
| `tub_wiki2` | `0x0A0E` | 2574 |

**Tub TRONOS**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_tronos` | `0x0A21` | 2593 |

**Tub ANIVERSARIOS**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_aniversarios_1` | `0x0A42` | 2626 |
| `tub_aniversarios_2` | `0x0A5C` | 2652 |
| `tub_aniversarios_3` | `0x06A4` | 1700 |
| `tub_aniversarios_4` | `0x0A5B` | 2651 |
| `tub_aniversarios_5` | `0x0A65` | 2661 |
| `tub_aniversarios_6` | `0x0A59` | 2649 |

**Tub RESURGIDOS**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_resurgidos` | `0x0640` | 1600 |

**Tub HALLOWEEN**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_halloween` | `0x0A24` | 2596 |

**Tub GN**
| DEFNAME | Hex | Dec |
|---------|-----|-----|
| `tub_gn_1` | `0x0A70` | 2672 |
