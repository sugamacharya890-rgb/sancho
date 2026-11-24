# Sancho — Motion Graphics

Remotion (React + TypeScript) videos for Sancho. Brief & guardrails: [`brief/sancho_motion_brief.md`](brief/sancho_motion_brief.md).

| Composition | Spec | Source |
|---|---|---|
| **`SanchoPromo`** (main) | 22s · 1920×1080 · 30fps · 660 frames · light, reference-matched style | `src/MainVideo.tsx`, `src/promo/` |
| **`SanchoChasingVideo`** | 24s · 720 frames · Script 02 "Effortless Clarity Without Chasing", same identity | `src/chasing/` |
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

Background music: two original, license-free tracks synthesized in code, both on the same 120 bpm grid with hits locked to the scene beats, loudness-matched at about -14 LUFS:

| Track | Feel | Script | Composition |
|---|---|---|---|
| A | punchy pop: four-on-the-floor, plucks, claps | `scripts/compose_promo_bgm.py` | `SanchoPromo` |
| B | warm, uplifting: marimba + piano, half-time groove, finger snaps | `scripts/compose_promo_bgm_b.py` | `SanchoPromoBgmB` |

Render track B: `npx remotion render src/index.ts SanchoPromoBgmB out/sancho-promo-bgm-b.mp4 --codec=h264 --crf=16`.
To make B the default, change the `bgm` default in `src/MainVideo.tsx`. Regenerate A after timing changes with `npm run bgm` (needs Python + numpy).

## Swap before release

- **Logo:** replace `public/brand/sancho-mark.svg` (placeholder) with the official mark — every scene picks it up. If the official file already includes the wordmark, pass `showWord={false}` to `SanchoLogo`.
- **CTA:** `BrandWipeOutro` takes a `cta` prop (default "Download the Sancho app").

## SanchoChasingVideo (Script 02 — `brief/sancho_script_02_chasing.md`)

| Scene | Frames | Time | Beat |
|---|---|---|---|
| `ChasingLoop` | 0–165 | 0:00–0:05.5 | "Still texting to find out what happened?" → "Chasing updates gets exhausting." over a thread of unanswered, coral-pulsing questions |
| `MeetVisibility` | 165–375 | 0:05.5–0:12.5 | "Meet [Sancho]" → lockup docks as header, stacked feed with depth-of-field, cursor taps "Visit summary shared • Next step clear", "Clarity without chasing." |
| `FollowThroughBehind` | 375–555 | 0:12.5–0:18.5 | "Steady follow-through behind the scenes." ribbon sweep behind a timeline card that keeps moving; "Nothing slips" / "No micromanaging" |
| `DownloadOutro` | 555–720 | 0:18.5–0:24 | Teal wipe + "Calm care from anywhere." pill → circle wipe to logo lockup + **Download Now** |

Reuses `src/promo/theme.ts` and `src/promo/primitives/*` so palette, type and motion are identical. Soundtrack: `scripts/compose_chasing_bgm.py` (uses `scripts/sancho_audio.py`), every cue pinned to a scene frame.
Optional voiceover: pass `voiceover="audio/your-vo.mp3"` as a prop and the music ducks under it.

```bash
npx remotion studio src/index.ts      # pick "SanchoChasingVideo"
npx remotion render src/index.ts SanchoChasingVideo out/sancho-chasing.mp4 --codec=h264 --crf=16
```

### Voiceover (Script 02)

AI voiceover generated with **Kokoro-82M** (open-weight, Apache-2.0) via `kokoro-onnx`, then loudness-normalized to about -16 LUFS:

| File | Voice | Composition |
|---|---|---|
| `public/audio/sancho-chasing-vo.mp3` | `af_heart` (warm female, default) | `SanchoChasingVideo` |
| `public/audio/sancho-chasing-vo-male.mp3` | `am_michael` (calm male) | `SanchoChasingVideoMaleVO` |
| none | music only | `SanchoChasingVideoMusicOnly` |

The music ducks about 10.5 dB only while the voice is speaking (spans in `src/chasing/voiceoverTiming.ts`).
The narration is Script 02's, lightly tightened to fit 24 s at a natural pace; edit `LINES` in `scripts/generate_voiceover.py` to change it.

Regenerate (needs `pip install kokoro-onnx soundfile` and the model from
[onnx-community/Kokoro-82M-v1.0-ONNX](https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX): `onnx/model.onnx` + `voices/*.bin` in one folder):

```bash
python scripts/generate_voiceover.py /path/to/kokoro-model --voice af_heart --timing src/chasing/voiceoverTiming.ts
npx remotion ffmpeg -y -i public/audio/sancho-chasing-vo.wav -af loudnorm=I=-16:TP=-1.5:LRA=7 -ar 44100 -c:a libmp3lame -b:a 192k -f mp3 public/audio/sancho-chasing-vo.mp3
```

```bash
npx remotion render src/index.ts SanchoChasingVideo out/sancho-chasing.mp4 --codec=h264 --crf=16
npx remotion render src/index.ts SanchoChasingVideoMaleVO out/sancho-chasing-male-vo.mp4 --codec=h264 --crf=16
```

### Nepali voiceover (नेपाली)

`SanchoChasingVideoNepaliVO` uses `public/audio/sancho-chasing-vo-ne.mp3`: an expressive female voice synthesized offline with **Piper**
(`ne_NP-google-medium`, speaker 9, dataset OpenSLR 43 CC BY-SA 4.0). Each line has its own emotion (weary → bright reveal → warm → confident → calm → energetic CTA) via pace, expressiveness and formant-preserving pitch, followed by a crisp vocal chain (presence/air EQ, de-ess, compression). Narration:

| Time | Nepali | English source |
|---|---|---|
| 0:00 | आमाबुबा नेपालमा हुनुहुन्छ भने, डाक्टरले के भन्नुभयो भनेर थाहा पाउन जासुसी गरेझैं गर्नु नपरोस्। | …finding out what the doctor said shouldn't feel like detective work. |
| 0:05.6 | प्रस्तुत छ, सन्चो। | Meet Sancho. |
| 0:07 | आमाबुबालाई बारम्बार सोधिरहनु नपरी, व्यावसायिक हेरचाह प्रक्रियामार्फत सधैं जानकारीमा रहनुहोस्। | Stay informed through a professional care process, without chasing your parents for answers. |
| 0:12.6 | हरेक अपडेटको पछाडि, सन्चोको प्रणालीले निरन्तर हेरचाहको पूरा ख्याल राख्छ, ताकि केही पनि नछुटोस्। | Behind every update, Sancho's system stays on top of ongoing care, so nothing important slips. |
| 0:18.7 | जहाँबाट पनि, ढुक्क भएर जानकारीमा रहनुहोस्। | Stay informed with calm confidence, from anywhere. |
| 0:21.7 | आजै सन्चो डाउनलोड गर्नुहोस्। | Download Sancho now. |

Regenerate (needs `pip install "piper-tts>=1.5" soundfile` and the voice from
[rhasspy/piper-voices](https://huggingface.co/rhasspy/piper-voices/tree/main/ne/ne_NP/google/medium)):

```bash
python scripts/generate_voiceover_ne.py /path/to/piper-voices-dir --voice google --speaker 9 --timing src/chasing/voiceoverTimingNe.ts
npx remotion ffmpeg -y -i public/audio/sancho-chasing-vo-ne.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 44100 -c:a libmp3lame -b:a 192k -f mp3 public/audio/sancho-chasing-vo-ne.mp3
npx remotion render src/index.ts SanchoChasingVideoNepaliVO out/sancho-chasing-nepali-vo.mp4 --codec=h264 --crf=16
```
