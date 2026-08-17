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
- `/search.html` — client-side search across the prepared archive index

### Sitting-level visual readings
- `/sessions/1946-12-09.html` — **9 December 1946: The First Sitting**
- `/sessions/1946-12-10.html` — **10 December 1946: The Assembly Makes Its Rules**
- `/sessions/1946-12-11.html` — **11 December 1946: A Permanent President Is Elected**
- `/sessions/1946-12-13.html` — **13 December 1946: The Objectives Resolution**

The 11 December page deliberately centres **Dr. Sachchidananda Sinha**, who announces the election and presides over the transition. It does not use a generic or placeholder Rajendra Prasad portrait. A Rajendra Prasad personality page will wait for a dedicated custom illustration.

### Personality profiles
- `/speakers/sachchidananda-sinha.html`
- `/speakers/jb-kripalani.html`
- `/speakers/jawaharlal-nehru.html`

### Theme readings
- `/topics/rules-procedure.html`
- `/topics/objectives-resolution.html`

## Source-indexed but not yet sitting-level visual reading

- `data/session-1946-12-12.json` — Objectives Resolution discussion postponed

The date is visible in chronology as **source indexed**. A complete visual sitting page is added only when its content structure and visual treatment meet the archive standard.

## Portrait assets currently committed

The site uses repository-hosted WebP illustrations, not runtime or external image URLs:

- `assets/sachchidananda-sinha-illustrated.webp`
- `assets/jb-kripalani-illustrated.webp`
- `assets/nehru-illustrated.webp`

## Locked visual direction

The approved light-theme debate reader is the master design reference for this project.

- warm cream / parchment background;
- restrained saffron, green and Ashoka-blue accents;
- serif editorial typography and fine archival borders;
- custom illustrated personality portraits rather than generic stock/headshot assets;
- Parliament / Constituent Assembly / elephant / archival motifs used sparingly;
- speaker card + large excerpt + editorial summary + annotations + linked themes/documents;
- structured visual transcript instead of long uninterrupted transcript text;
- a dark theme may exist, but it must inherit the same information architecture rather than become a separate redesign.

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## Source policy

The **Parliament Digital Library / Lok Sabha Secretariat** is the canonical source for debate records used by this project. The interface links back to the official record rather than mirroring complete PDFs or full transcripts.

The project explicitly separates:

1. primary-source excerpts and metadata;
2. editorial summaries;
3. thematic / constitutional links;
4. custom visual assets.

We do not invent timestamps, quotations or archival audio. See [SOURCES.md](SOURCES.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Product architecture

Top-level modes now implemented in the prototype:

- **Home** — entry point and available visual readings.
- **Chronology** — sitting order with visual-ready and source-indexed states.
- **Sessions** — visual reading of an individual sitting.
- **Themes** — ideas connected across dates and speakers.
- **Speakers** — interventions and themes grouped by personality.
- **Constitutional provisions** — debates connected to later constitutional text with editorial caveats.
- **Documents / Sources** — primary records and provenance.
- **Search** — prepared-index search by date, person, theme, provision and source.

## Deployment integrity

Every GitHub Pages deployment runs `scripts/check-site.mjs` before publishing. The check validates:

- local HTML/CSS/JS/image references;
- required public routes;
- required WebP personality assets;
- structured JSON syntax;
- absence of retired SVG portrait references.

## Development principle

Accuracy comes before filling the interface. A date may be source-indexed before its full visual page is authored. Sitting-level pages become public only when source structure and required visual assets meet the archive standard.