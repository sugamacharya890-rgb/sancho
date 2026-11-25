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

`SanchoChasingVideoNepaliVO` uses `public/audio/sancho-chasing-vo-ne.mp3`, generated with
**AI4Bharat Indic Parler-TTS** (Apache-2.0, gated — accept the terms + Hugging Face read token), female speaker *Amrita*.
Each line has its own delivery description (tired → bright reveal → warm → confident → calm → energetic).
3 takes per line are transcribed back with Whisper (faster-whisper `medium`, Nepali); the clearest take that fits its scene is kept,
then a gentle clarity chain (low-cut, presence, light compression) is applied.

| Time | Nepali | Meaning |
|---|---|---|
| 0:00 | टाढा बस्दा, आमाबुबाको खबर बुझ्न जासुसी गर्नु नपरोस्। | Living far away, understanding your parents' news shouldn't take detective work. |
| 0:05.6 | प्रस्तुत छ, सन्चो। | Meet Sancho. |
| 0:07 | अब बारम्बार सोधिरहनु पर्दैन। हरेक जानकारी, सधैं स्पष्ट। | No more asking again and again. Every update, always clear. |
| 0:12.6 | हरेक अप्डेटको पछाडि, सन्चोको प्रणालीले हेरचाहलाई निरन्तर अघि बढाइरहन्छ। | Behind every update, Sancho's system keeps care moving forward. |
| 0:18.7 | जहाँबाट पनि, ढुक्क भएर जानकारीमा रहनुहोस्। | Stay informed with calm confidence, from anywhere. |
| 0:21.7 | आजै सन्चो डाउनलोड गर्नुहोस्। | Download Sancho today. |

Regenerate (CPU is fine; ~10–15 min):

```bash
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install parler-tts faster-whisper soundfile "protobuf>=5.28"
HF_TOKEN=<your read token> python scripts/generate_voiceover_ne_parler.py
npx remotion ffmpeg -y -i public/audio/sancho-chasing-vo-ne.wav -af loudnorm=I=-16:TP=-1.5:LRA=9 -ar 44100 -c:a libmp3lame -b:a 192k -f mp3 public/audio/sancho-chasing-vo-ne.mp3
npx remotion render src/index.ts SanchoChasingVideoNepaliVO out/sancho-chasing-nepali-vo.mp4 --codec=h264 --crf=16
```

The earlier Piper-based generator (`scripts/generate_voiceover_ne.py`) is kept for reference.

## Vertical 9:16 for Instagram Reels / Stories / TikTok

`SanchoChasingVertical` — 1080×1920, 30 fps, 24 s, background music only. The Script 02 scenes are layout-aware
(`src/chasing/layout.ts`): headlines on top, UI stacked below, key content kept inside the Reels safe zone
(roughly y 250–1600). The 16:9 compositions are unchanged.

```bash
npx remotion render src/index.ts SanchoChasingVertical out/sancho-chasing-vertical.mp4 --codec=h264 --crf=17
# Instagram-safe finish: limited-range yuv420p, BT.709 tags, fast start (needs ffmpeg with libx264)
ffmpeg -y -i out/sancho-chasing-vertical.mp4 -vf "scale=in_range=full:out_range=limited,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -level 4.1 -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a copy -movflags +faststart out/sancho-chasing-vertical-ig.mp4
```

## Rakshya (रक्षा) · Reel 01 — Origin & Why Silence Isn't Safety

24s vertical Instagram Reel (1080×1920, 30fps, 720 frames) promoting rakshyanp.com. Brief: `brief/rakshya_reel_01_origin.md`.

- Composition: `RakshyaReel01Origin` (with music) and `RakshyaReel01OriginSilent` (no audio, to add a track in Instagram).
- Code: `src/rakshya/` — `theme.ts` (blush/crimson palette, beat timeline, Reels safe area), `fonts.ts` (Instrument Serif + Noto Serif Devanagari + Inter, bundled), `primitives/`, and one component per beat in `scenes/`.
- Music: `npm run bgm:rakshya` re-synthesizes the original, license-free 80 BPM piano + felt pad (`scripts/compose_rakshya_bgm.py` → `public/audio/rakshya-reel01-bgm.mp3`). Hook points are listed in `src/rakshya/RakshyaReel01Origin.tsx`.
- Render: `npm run render:rakshya` → `out/rakshya-reel01-origin.mp4`.
- The `र` brand tile in `RakshyaLockup.tsx` is a stand-in; swap in the official logo file if there is one.
