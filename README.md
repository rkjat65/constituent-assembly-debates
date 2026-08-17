# Constituent Assembly Debates — Visual Archive

A visual-first platform for exploring the Constituent Assembly Debates of India **chronologically, by theme, by personality and by constitutional provision** without turning the archive into a wall of text.

**Website concept, information design and presentation by Radhakishan Jat.**

## Live preview

GitHub Pages deploys automatically from `main`:

`https://rkjat65.github.io/constituent-assembly-debates/`

## Current public routes

### Core explorers
- `/` — Archive Home
- `/chronology.html` — chronological explorer
- `/speakers.html` — personality explorer
- `/themes.html` — thematic explorer
- `/documents.html` — Parliament Digital Library source index
- `/provisions.html` — constitutional-provision cross-reference layer
- `/visual-atlas.html` — custom editorial artwork and visual-system explorer
- `/search.html` — client-side search across the prepared archive index

### Sitting-level visual readings
- `/sessions/1946-12-09.html` — **9 December 1946: The First Sitting**
- `/sessions/1946-12-10.html` — **10 December 1946: The Assembly Makes Its Rules**
- `/sessions/1946-12-11.html` — **11 December 1946: A Permanent President Is Elected**
- `/sessions/1946-12-12.html` — **12 December 1946: Before the Objectives Resolution**
- `/sessions/1946-12-13.html` — **13 December 1946: The Objectives Resolution**
- `/sessions/1946-12-17.html` — **17 December 1946: Ambedkar on Unity and the Beginning**

### Personality profiles
- `/speakers/sachchidananda-sinha.html`
- `/speakers/rajendra-prasad.html`
- `/speakers/br-ambedkar.html`
- `/speakers/jb-kripalani.html`
- `/speakers/jawaharlal-nehru.html`

### Theme readings
- `/topics/rules-procedure.html`
- `/topics/objectives-resolution.html`

## Visual assets currently committed

The visual layer is a product feature, not page decoration. Assets are repository-hosted so GitHub Pages does not depend on temporary external URLs.

### Personality illustrations
- `assets/sachchidananda-sinha-illustrated.webp`
- `assets/jb-kripalani-illustrated.webp`
- `assets/nehru-illustrated.webp`
- `assets/rajendra-prasad-engraved.svg`
- `assets/ambedkar-engraved.svg`

### Editorial scene / idea illustrations
- `assets/assembly-hall-panorama.svg`
- `assets/objectives-resolution-visual.svg`

The vector assets are intentionally labelled as editorial illustrations. They are not official portraits, archival photographs or facsimiles.

## Locked visual direction

The approved light-theme debate reader is the master design reference for this project.

- warm cream / parchment background;
- restrained saffron, green and Ashoka-blue accents;
- serif editorial typography and fine archival borders;
- custom illustrated personality portraits rather than generic stock/headshot assets;
- Parliament / Constituent Assembly / elephant / archival motifs used sparingly;
- speaker card + large excerpt + editorial summary + annotations + linked themes/documents;
- structured visual transcript instead of long uninterrupted transcript text;
- editorial reconstructions are visibly labelled;
- a dark theme may exist, but it inherits the same information architecture rather than becoming a separate redesign.

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Source policy

The **Parliament Digital Library / Lok Sabha Secretariat** is the canonical source for debate records used by this project. The interface links back to the official record rather than mirroring complete PDFs or full transcripts.

The project explicitly separates:

1. primary-source excerpts and metadata;
2. editorial summaries;
3. thematic / constitutional links;
4. custom visual assets.

We do not invent timestamps, quotations or archival audio. See [SOURCES.md](SOURCES.md).

## Data layer

Structured session, chronology and search data live under `/data` so the archive can later move from static prototypes to a generated application without rewriting the content model.

Current visual-reading data includes:

- `data/session-1946-12-09.json`
- `data/session-1946-12-10.json`
- `data/session-1946-12-11.json`
- `data/session-1946-12-12.json`
- `data/session-1946-12-13.json`
- `data/session-1946-12-17.json`
- `data/chronology.json`
- `data/search-index.json`

## Deployment reliability

GitHub Pages runs `scripts/check-site.mjs` before every deployment. The check currently validates:

- local HTML links and asset references;
- JSON parsing;
- SVG markup and accessible titles;
- presence of required routes, portraits and visual assets.

A broken local route or missing key illustration should therefore stop deployment rather than silently publish a damaged archive.

## Development principle

Accuracy comes before filling the interface. A date may be source-indexed before its complete visual reading exists. A full visual page is published only when the record, editorial structure and visual treatment are ready.