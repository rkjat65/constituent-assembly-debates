# Constituent Assembly Debates — Visual Archive

A visual-first platform for exploring the Constituent Assembly Debates of India **chronologically, by theme, by personality and by constitutional provision** without turning the archive into a wall of text.

**Website concept, information design and presentation by Radhakishan Jat.**

## Live preview

GitHub Pages deploys automatically from `main`:

`https://rkjat65.github.io/constituent-assembly-debates/`

## Current routes

- `/` — **Archive Home**
- `/chronology.html` — chronological explorer
- `/speakers.html` — personality explorer
- `/themes.html` — thematic explorer
- `/sessions/1946-12-09.html` — **9 December 1946: The First Sitting**
- `/sessions/1946-12-10.html` — **10 December 1946: The Assembly Makes Its Rules**
- `/sessions/1946-12-13.html` — **13 December 1946: The Objectives Resolution**

## Portrait assets currently committed

The site uses repository-hosted WebP illustrations, not runtime or external image URLs:

- `assets/sachchidananda-sinha-illustrated.webp`
- `assets/jb-kripalani-illustrated.webp`
- `assets/nehru-illustrated.webp`

This keeps the visual readings portable on GitHub Pages and prevents broken external-image dependencies.

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

## Source policy

The **Parliament Digital Library / Lok Sabha Secretariat** is the canonical source for debate records used by this project. The interface links back to the official record rather than mirroring complete PDFs or full transcripts.

The project explicitly separates:

1. primary-source excerpts and metadata;
2. editorial summaries;
3. thematic / constitutional links;
4. custom visual assets.

We do not invent timestamps, quotations or archival audio. See [SOURCES.md](SOURCES.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Data layer

Structured session and chronology data live under `/data` so the archive can later move from static prototypes to a generated application without rewriting the content model.

Current seeds:

- `data/session-1946-12-09.json`
- `data/session-1946-12-10.json`
- `data/session-1946-12-13.json`
- `data/chronology.json`

## Product architecture

Top-level modes:

- **Home** — entry point and available visual readings.
- **Chronology** — every sitting from the beginning to the end in official date order.
- **Sessions** — visual reading of an individual sitting.
- **Themes** — ideas connected across dates and speakers.
- **Speakers** — interventions and themes grouped by personality.
- **Constitutional provisions** — debates connected to the eventual constitutional text.
- **Documents / Sources** — primary records, provenance and editorial notes.
- **Search / Library** — later product layer for research and saved material.

## Development principle

Accuracy comes before filling the interface. A date or sitting may appear in the chronology before its detailed page is authored; it should become clickable only when its source, content structure and portrait assets have been verified.