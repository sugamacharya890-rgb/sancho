# Sancho — Motion Graphics

Remotion (React + TypeScript) videos for Sancho. Brief & guardrails: [`brief/sancho_motion_brief.md`](brief/sancho_motion_brief.md).

| Composition | Spec | Source |
|---|---|---|
| **`SanchoPromo`** (main) | 22s · 1920×1080 · 30fps · 660 frames · light, reference-matched style | `src/MainVideo.tsx`, `src/promo/` |
| `SanchoExplainer` | 48s · dark editorial explainer (v1 brief, kept for reference) | `src/ExplainerVideo.tsx`, `src/scenes/` |

## SanchoPromo timeline (120 bpm — 1 beat = 15 frames)

| Scene | Frames | Time | Beat |
|---|---|---|---|
| `HookAndBrand` | 0–135 | 0:00–0:04.5 | "Caring for parents from abroad?" → overload chips → **Meet [Sancho]** (logo hit on the beat) |
| `FollowThroughUI` | 135–330 | 0:04.5–0:11 | Phone rises on teal aura with "Steady follow-through" / "From afar"; items auto-complete; camera push, brand ribbon sweep, floating "This week, handled" card |
| `VisibilityFeed` | 330–525 | 0:11–0:17.5 | Unanswered chasing messages → "Clear updates. Zero chasing." stacked feed, depth-of-field focus, pointer taps the visit update |
| `BrandWipeOutro` | 525–660 | 0:17.5–0:22 | Teal brand wipe, "Stay on top of care." + "Peace of mind from afar" pill, circle wipe to the centered lockup + CTA |

Primitives (`src/promo/primitives/`): `AuraGlow`, `KineticText`, `SanchoLogo`, `PhoneFrame`, `PointerCursor`, `BrandRibbon`, `Check`.

## Commands

```bash
npm install
npx remotion studio src/index.ts      # preview (pick "SanchoPromo")
npx remotion render src/index.ts SanchoPromo out/sancho-promo.mp4 --codec=h264 --crf=16
```

Background music is an original track synthesized by `scripts/compose_promo_bgm.py` (license-free, hits locked to scene beats, ≈ -14 LUFS). Regenerate after timing changes with `npm run bgm` (needs Python + numpy).

## Swap before release

- **Logo:** replace `public/brand/sancho-mark.svg` (placeholder) with the official mark — every scene picks it up. If the official file already includes the wordmark, pass `showWord={false}` to `SanchoLogo`.
- **CTA:** `BrandWipeOutro` takes a `cta` prop (default "Download the Sancho app").
