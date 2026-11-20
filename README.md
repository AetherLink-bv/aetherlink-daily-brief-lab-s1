# Daily brief: individuele Day 5-route

Je bouwt zelfstandig één lokale daily brief in zeven opdrachten. Eén lokaal agenda-item wordt eerst één beslisregel. Daarna groeit dezelfde route uit tot een geteste HTML-pagina met precies één read-only tool.

Alles draait met lokale voorbeelddata. Je gebruikt geen account, sleutel, live bron of publicatie-oefening. De repository zelf behoudt wel een controle voor lesmakers.

## Start

Gebruik Node.js 20 of nieuwer, Git en Claude Code. Voer dit uit vanaf een terminal:

```bash
git clone https://github.com/AetherLink-bv/aetherlink-daily-brief-lab-s1.git
cd aetherlink-daily-brief-lab-s1
npm ci
claude --setting-sources project,user --strict-mcp-config --no-chrome
```

Lees `SOLO.md`. Voer één opdracht tegelijk uit. Bekijk iedere diff en accepteer alleen werk dat je begrijpt.

## De zeven opdrachten

| Opdracht | Resultaat | Bewijs |
| --- | --- | --- |
| A1 | Kies één gebruiker en één ochtendbeslissing. Bouw daarna het lokale mini-pad. | `npm run test:mini` en `npm run mini` |
| A2 | Leg het volledige briefschema vast en maak de schematest rood en daarna groen. | `npm run test:schema` |
| A3 | Leg ontwerp, één besluit en een uitvoerbaar plan vast. | Menselijke goedkeuring en een plan met paden, bewijs en rollback |
| A4 | Render de voorbeeldbrief als lokale HTML-pagina. | `npm run test:render` en `npm run brief:sample` |
| A5 | Voeg precies één read-only agendatool toe. Spoor een ontbrekend veld op. | `npm run test:tool` |
| A6 | Evalueer gewone, ontbrekende en conflicterende invoer. Lever lokaal op vanuit een verse checkout. | `npm run eval`, alle controles en rollback in een tijdelijke checkout |
| A7 | Ontwerp en bouw zelfstandig een nieuwe kleine lokale toepassing. | Een rode test, werkende uitvoer en jouw eigen zichtbare resultaat |

## Grenzen

- Gebruik alleen lokale voorbeelddata.
- Geef de brief geen shell-, netwerk- of schrijftool.
- Houd de ene brontool read-only.
- Verzin geen ontbrekende feiten. Toon `OPEN` bij ontbrekende invoer.
- Kies niet stil tussen conflicterende feiten. Toon `CONFLICT`.
- Bewaar alleen geaccepteerd werk in een commit.

## Bestanden

`CLAUDE.md`, `AGENTS.md`, `intent.md`, `progress.md` en `SOLO.md` sturen de route. De map `docs/` bevat de templates. De map `sample/` bevat alle lokale invoer.

## Interactieve uitleg

Open de lokale cursus zonder server:

```bash
open course/index.html
```

Pas bronmodules aan onder `course/modules/`. Bouw daarna de cursus opnieuw met:

```bash
cd course
bash build.sh
```
