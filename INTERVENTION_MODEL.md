# Granular Intervention Model

The archive should not reduce a sitting to one famous speaker. Each sourced sitting is progressively converted into a speaker-by-speaker, intervention-by-intervention reading layer.

## Source hierarchy

1. **Canonical record:** Parliament Digital Library / Lok Sabha Secretariat.
2. **Paragraph navigation reference:** an edited transcript may be used to identify speaker boundaries and paragraph references when the official PDF does not expose stable paragraph anchors.
3. **Editorial layer:** summaries, tags, stance labels and constitutional links are written for this archive and must never be presented as quotations.

The UI must visually distinguish exact wording from editorial paraphrase.

## Session JSON

A granular session uses:

```json
{
  "session": {},
  "speakers": [],
  "interventions": [],
  "themes": [],
  "editorialStatus": "granular-speaker-timeline-live"
}
```

## Speaker object

```json
{
  "id": "ambedkar",
  "name": "Dr. B. R. Ambedkar",
  "role": "Member · Constituent Assembly",
  "portrait": "assets/ambedkar-engraved.svg",
  "profile": "speakers/br-ambedkar.html",
  "stance": "Urges prudence and accommodation",
  "positionSummary": "Editorial summary of this person's position in this sitting."
}
```

Portraits are optional until a historically recognisable caricature is ready. A neutral initial marker is preferable to a distorted or generic face.

## Intervention object

```json
{
  "id": "p-1-7-29",
  "speakerId": "ambedkar",
  "paragraphRef": "1.7.29–1.7.30",
  "kind": "Prudence",
  "summary": "Editorial paraphrase of the intervention.",
  "excerpt": "Optional short exact phrase.",
  "tags": ["prudence", "conciliation"]
}
```

### Rules

- Preserve chronological order.
- Include the Chair when the Chair materially shapes the proceedings.
- Include procedural events such as calling a speaker, moving/seconding, rulings, votes and adjournment when they affect the debate.
- `summary` is always editorial.
- `excerpt` is always exact wording and should stay short.
- `paragraphRef` identifies the transcript segment used for cross-checking.
- A speaker must exist in `speakers[]` before an intervention can reference that `speakerId`.
- Do not invent clock times for individual interventions unless the source provides them.
- Do not fabricate audio controls or imply that a text segment has audio unless archival audio is actually available.

## UI behaviour

The granular reader provides:

- a sitting census;
- a horizontal speaker filter;
- chronological intervention stream;
- exact-word callouts separated from paraphrase;
- paragraph references;
- primary-source verification links;
- a position matrix containing every indexed speaking voice.

## Current granular reference sittings

- `13 December 1946` — Chair + Jawaharlal Nehru + Purushottam Das Tandon.
- `17 December 1946` — Chair + M. R. Masani + Frank Anthony + Syama Prasad Mookerjee + B. R. Ambedkar + Sardar Ujjal Singh + Seth Govind Das.

This model should be applied chronologically to subsequent sittings.