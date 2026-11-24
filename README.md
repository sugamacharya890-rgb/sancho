# Sancho — Motion Graphics Explainer

48-second, 1920×1080, 30fps (1,440 frames) explainer built with Remotion. Creative brief and guardrails: [`brief/sancho_motion_brief.md`](brief/sancho_motion_brief.md).

## Timeline

| Scene | Frames | Time | Beat |
|---|---|---|---|
| `Scene1Overload` | 0–360 | 0:00–0:12 | Remote overload: time-zone cue, care details piling up in amber |
| `Scene2FollowThrough` | 360–780 | 0:12–0:26 | Cards morph onto the self-advancing teal continuity track |
| `Scene3Visibility` | 768–1200 | 0:26–0:40 | Chasing thread dissolves into one calm visit summary |
| `Scene4Outro` | 1188–1440 | 0:40–0:48 | Brand lockup → app glimpse + download CTA |

Scenes 3 and 4 start 12 frames early so the hand-offs crossfade.

## Structure

```
src/
  theme/        colors, easing, timeline, fonts (bundled via @fontsource)
  primitives/   AmbientGrid, FadeSlideText, ContinuityTrack, StatusCard, SanchoMark, Icons
  scenes/       Scene1–4 + shared card data (careItems.ts)
  MainVideo.tsx composes the scenes + score
scripts/compose_score.py   original, license-free score synthesized to the frame timeline
public/audio/sancho-score.mp3
```

## Commands

```bash
npm install
npm run studio          # live preview
npm run render          # -> out/sancho-explainer.mp4
```

Explicit render command:

```bash
npx remotion render src/index.ts SanchoExplainer out/sancho-explainer.mp4 --codec=h264 --crf=16
```

Regenerate the score after timing changes (requires numpy):

```bash
python3 scripts/compose_score.py && npx remotion ffmpeg -y -i public/audio/sancho-score.wav -c:a libmp3lame -b:a 256k -f mp3 public/audio/sancho-score.mp3 && rm public/audio/sancho-score.wav
```

## To swap before release

- `SanchoMark.tsx` is a placeholder mark — replace with the official logo.
- `Scene4Outro` CTA copy is a prop (`ctaLabel`, `ctaSub`): set the real store availability / URL.
