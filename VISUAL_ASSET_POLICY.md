# Visual Asset Policy

The archive has three layers:

1. **Official historical record** — debate text, dates, speakers, motions and metadata sourced from Parliament Digital Library / Lok Sabha Secretariat.
2. **Editorial learning layer** — summaries, argument maps, theme labels, cross-links and explanatory notes authored for the archive.
3. **Generated visual layer** — original editorial portraits and scene artwork created for this archive.

## Non-negotiable personality rule

Every personality image published in the website UI must come from the generated portrait library under `assets/portraits/`.

Do not publish personality photographs, stock portraits, scraped web images, archival headshots or code-drawn faces in the public interface. Historical photographs may be consulted as likeness references, but the published asset must be our generated editorial portrait.

If a generated portrait has not yet been uploaded, use **text or initials only**. Never substitute another image merely to fill the slot.

## Portrait style

All personality portraits belong to one visual family:
- recognisable historical likeness first;
- sepia / ink / watercolour editorial treatment;
- warm parchment background;
- restrained saffron, white and green accents;
- dignified rather than comic caricature;
- mobile-safe crop with strong facial readability;
- no text baked into the image.

The canonical filename registry is `assets/portraits/manifest.json`. Upload a portrait to the exact path mapped there and the website should begin using it without debate-by-debate asset edits.

## Historical scenes

Generated scene artwork is allowed when it has a clear historical or learning purpose, period-appropriate setting and an explicit editorial-reconstruction label where needed.

Do not publish schematic HTML/CSS/SVG drawings as substitutes for artwork. Do not present generated scenes as archival photographs.

## Constitutional concept visuals

Concept art may be symbolic but must be genuine generated editorial artwork. Exact constitutional text remains separate and source-attributed.

## Current portrait source of truth

`assets/portraits/manifest.json`

The first generated set already present includes Sachchidananda Sinha, Rajendra Prasad, B. R. Ambedkar, Jawaharlal Nehru, J. B. Kripalani, Sarvepalli Radhakrishnan, K. M. Munshi, Syama Prasad Mookerjee, Alladi Krishnaswami Ayyar and Hansa Mehta.

Other names may safely render as initials until their matching `.webp` file is uploaded.

## Permanently retired

- archival personality photographs;
- code-drawn SVG personalities;
- code-drawn historical chamber scenes;
- generic or substitute faces;
- any personality asset outside the canonical generated portrait library.

**Website and editorial direction: Radhakishan Jat.**
