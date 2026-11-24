"""
Clear, expressive Nepali female voiceover for SanchoChasingVideo using AI4Bharat Indic Parler-TTS
(https://huggingface.co/ai4bharat/indic-parler-tts, Apache-2.0, gated: accept the terms + HF read token).

Each line gets a plain-language delivery description (emotion, pace, clarity). Several takes are
generated per line and the one that best fits its scene window is kept; small timing fixes use
formant-preserving rubberband time-stretch (never more than ±8%).

Setup:  pip install torch --index-url https://download.pytorch.org/whl/cpu ; pip install parler-tts soundfile
Run:    HF_TOKEN=<token or proxy-injected> python scripts/generate_voiceover_ne_parler.py
        -> public/audio/sancho-chasing-vo-ne.wav + src/chasing/voiceoverTimingNe.ts
"""
import argparse
import os
import subprocess
import tempfile

import numpy as np
import soundfile as sf
import torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer

MODEL = 'ai4bharat/indic-parler-tts'
SPEAKER = 'Amrita'  # AI4Bharat's recommended Nepali female speaker
QUALITY = "The recording is of very high quality, with the speaker's voice sounding clear and very close up, with no background noise."
DUR = 24.0

# start, window end (next line's start), Nepali text, delivery
LINES = [
    (0.15, 5.5, "आमाबुबा नेपालमा हुनुहुन्छ भने, डाक्टरले के भन्नुभयो भनेर थाहा पाउन जासुसी गर्नु नपरोस्।",
     f"{SPEAKER} speaks in a tired, slightly frustrated tone at a moderate pace, with natural pauses."),
    (5.6, 6.9, "प्रस्तुत छ, सन्चो।",
     f"{SPEAKER} speaks in a bright, excited and warm tone, clearly and a little slowly, with a smile in her voice."),
    # shortened from the earlier long line so it reads calmly instead of rushed
    (7.0, 12.5, "अब बारम्बार सोधिरहनु पर्दैन। हरेक जानकारी, सधैं स्पष्ट।",
     f"{SPEAKER} speaks in a warm, reassuring and calm tone at a slow, relaxed pace, with a clear pause between sentences."),
    (12.6, 18.6, "हरेक अप्डेटको पछाडि, सन्चोको प्रणालीले हेरचाहको पूरा ख्याल राख्छ, ताकि केही पनि नछुटोस्।",
     f"{SPEAKER} speaks in a confident, steady and trustworthy tone at a moderate pace."),
    (18.75, 21.6, "जहाँबाट पनि, ढुक्क भएर जानकारीमा रहनुहोस्।",
     f"{SPEAKER} speaks in a calm, gentle and uplifting tone at a moderate pace."),
    (21.75, 23.9, "आजै सन्चो डाउनलोड गर्नुहोस्।",
     f"{SPEAKER} speaks in an energetic, cheerful and confident tone, clearly and emphatically."),
]


def stretch(x, sr, ratio, tmp):
    """ratio < 1 shortens. Formant-preserving, pitch unchanged."""
    a, b = os.path.join(tmp, 's_in.wav'), os.path.join(tmp, 's_out.wav')
    sf.write(a, x, sr)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-af', f'rubberband=tempo={1 / ratio:.4f}:formant=preserved', b], check=True)
    return sf.read(b, dtype='float32')[0]


def trim(x, sr, thresh=0.01):
    idx = np.nonzero(np.abs(x) > thresh)[0]
    return x if len(idx) == 0 else x[max(0, idx[0] - int(0.01 * sr)) : idx[-1] + int(0.08 * sr)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--takes', type=int, default=3)
    ap.add_argument('--out', default=os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'sancho-chasing-vo-ne.wav'))
    ap.add_argument('--timing', default=os.path.join(os.path.dirname(__file__), '..', 'src', 'chasing', 'voiceoverTimingNe.ts'))
    a = ap.parse_args()

    torch.set_num_threads(os.cpu_count() or 4)
    model = ParlerTTSForConditionalGeneration.from_pretrained(MODEL).eval()
    tok = AutoTokenizer.from_pretrained(MODEL)
    desc_tok = AutoTokenizer.from_pretrained(model.config.text_encoder._name_or_path)
    sr = model.config.sampling_rate

    track = np.zeros(int(DUR * sr), dtype=np.float32)
    spans = []
    with tempfile.TemporaryDirectory() as tmp:
        for start, win_end, text, desc in LINES:
            window = win_end - start
            d = desc_tok(f'{desc} {QUALITY}', return_tensors='pt')
            p = tok(text, return_tensors='pt')
            best = None
            for take in range(a.takes):
                torch.manual_seed(1000 + take)
                with torch.no_grad():
                    g = model.generate(input_ids=d.input_ids, attention_mask=d.attention_mask,
                                       prompt_input_ids=p.input_ids, prompt_attention_mask=p.attention_mask)
                x = trim(g.cpu().numpy().squeeze().astype(np.float32), sr)
                length = len(x) / sr
                # prefer takes that fill ~80% of the window without exceeding it
                score = abs(length - 0.82 * window) + (10 if length > window * 1.08 else 0)
                print(f'  {text[:24]}… take {take}: {length:.2f}s (window {window:.2f}s)')
                if best is None or score < best[0]:
                    best = (score, x)
            x = best[1]
            if len(x) / sr > window:
                x = stretch(x, sr, max(0.92, window / (len(x) / sr)), tmp)
            x *= 0.7 / max(1e-6, np.abs(x).max())
            i0 = int(start * sr)
            seg = x[: len(track) - i0]
            track[i0 : i0 + len(seg)] += seg
            spans.append((round(start, 3), round(start + len(x) / sr, 3)))
            print(f'{start:6.2f}s  {len(x) / sr:5.2f}s  ends {start + len(x) / sr:6.2f}s')
    sf.write(a.out, track, sr, subtype='PCM_16')
    with open(a.timing, 'w') as f:
        f.write('// Generated by scripts/generate_voiceover_ne_parler.py — Nepali speech spans in seconds, used to duck the music.\n')
        f.write('export const VO_SPANS_NE: [number, number][] = [\n')
        for st, en in spans:
            f.write(f'  [{st}, {en}],\n')
        f.write('];\n')
    print('wrote', os.path.abspath(a.out))


if __name__ == '__main__':
    main()
