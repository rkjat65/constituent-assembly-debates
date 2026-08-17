# Constituent Assembly Debates — Visual Archive

A visual-first platform for exploring the Constituent Assembly Debates of India **chronologically, by theme, personality and constitutional provision** without reducing the record to either a text wall or a collection of famous quotations.

**Website concept, information design and presentation by Radhakishan Jat.**

## Live preview

`https://rkjat65.github.io/constituent-assembly-debates/`

GitHub Pages deploys automatically from `main` after an integrity check.

## Core product model

The archive separates three layers:

1. **Official historical record** — Parliament Digital Library / Lok Sabha Secretariat is canonical.
2. **Editorial learning layer** — speaker segmentation, argument summaries, themes, links and context.
3. **Generated visual layer** — approved editorial artwork only.

Historical scenes and personalities are **not** drawn with HTML/CSS/SVG primitives as substitutes for artwork. If a strong generated asset is not ready, the relevant slot remains text- or initials-led.

See [VISUAL_ASSET_POLICY.md](VISUAL_ASSET_POLICY.md).

## Public routes

### Core explorers
- `/` — Archive Home
- `/chronology.html` — chronological explorer
- `/speakers.html` — personality explorer
- `/themes.html` — thematic explorer
- `/documents.html` — Parliament Digital Library source index
- `/provisions.html` — constitutional-provision cross-reference layer
- `/visual-atlas.html` — approved generated editorial artwork
- `/search.html` — archive search

### Opening sitting readings
- `/sessions/1946-12-09.html` — The First Sitting
- `/sessions/1946-12-10.html` — The Assembly Makes Its Rules
- `/sessions/1946-12-11.html` — A Permanent President Is Elected
- `/sessions/1946-12-12.html` — Before the Objectives Resolution

### Granular all-speaker timelines
- `/sessions/1946-12-13.html` — **The Objectives Resolution** · 3 speaking voices
- `/sessions/1946-12-16.html` — **Postpone or Proceed?** · 19 speaking / collective voices · 29 intervention blocks
- `/sessions/1946-12-17.html` — **Competing Paths to Unity** · 7 speaking voices · 15 intervention blocks
- `/sessions/1946-12-18.html` — **Rules, Minorities and the States** · 13 speaking voices
- `/sessions/1946-12-19.html` — **Rights, Representation and the Assembly's Authority** · 21 speaking / collective voices · 28 intervention blocks

The granular model records each intervention as:

`speaker → paragraph reference → intervention type → editorial summary → optional short exact excerpt → themes → source`

This allows the same underlying record to power chronology, personality, theme and eventually constitutional-provision views.

## Personality profiles

- `/speakers/sachchidananda-sinha.html`
- `/speakers/rajendra-prasad.html`
- `/speakers/br-ambedkar.html`
- `/speakers/jb-kripalani.html`
- `/speakers/jawaharlal-nehru.html`

A profile can exist before its generated portrait. No placeholder face is substituted.

## Approved generated portrait assets

- `assets/sachchidananda-sinha-illustrated.webp`
- `assets/jb-kripalani-illustrated.webp`
- `assets/nehru-illustrated.webp`

Rajendra Prasad, B. R. Ambedkar and additional personality portraits remain in the generated-art queue.

## Retired visual approach

Earlier code-drawn SVG chamber, document and personality illustrations are retired from the public visual system. Public HTML is validated to prevent those assets from being reintroduced accidentally.

## Source policy

The **Parliament Digital Library / Lok Sabha Secretariat** remains the canonical source for dated debate records. Paragraph-numbered third-party transcriptions may be used as a navigation and segmentation aid, but not as a replacement for the official record.

The project keeps distinct:
- primary-source excerpts and metadata;
- editorial summaries;
- thematic / constitutional links;
- generated artwork.

We do not invent timestamps, quotations or archival audio. See [SOURCES.md](SOURCES.md).

## Data layer

Session data lives under `/data`. Granular sessions contain `speakers[]` and `interventions[]`; `session-granular.js` renders speaker filters, intervention streams and speaker matrices from those files.

Search is also data-driven and loads the core index plus granular speaker supplements, allowing new dates to be added without turning `search.js` into a hand-written content database.

## Deployment reliability

`scripts/check-site.mjs` runs before GitHub Pages deployment. It validates:
- local routes and assets;
- JSON syntax;
- granular-session speaker/intervention integrity;
- required public routes/data files;
- the generated-art-only rule by rejecting retired coded visuals in public HTML.

## Development principle

**Accuracy before filling the interface.** A source can be indexed before its reading is complete. A generated image appears only after it is visually and historically good enough. The archive should become richer without becoming less trustworthy.
