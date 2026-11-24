"""
Nepali voiceover for SanchoChasingVideo (Script 02) — expressive female voice.
Synthesized offline with Piper; each line gets its own emotional delivery
(pace, expressiveness, pitch, energy), then a crisp "sharp" vocal chain.

Voices (https://huggingface.co/rhasspy/piper-voices, ne/ne_NP):
  google/medium   — 18 female speakers, dataset OpenSLR 43, CC-BY-SA-4.0  (default: speaker 9)
  chitwan/medium  — 1 speaker (lower, male-range pitch), dataset CC0

Setup:  pip install "piper-tts>=1.5" soundfile numpy ; ffmpeg with rubberband on PATH
Run:    python scripts/generate_voiceover_ne.py VOICE_DIR [--voice google --speaker 9] [--measure]
        -> public/audio/sancho-chasing-vo-ne.wav  (+ --timing src/chasing/voiceoverTimingNe.ts)
"""
import argparse
import os
import subprocess
import tempfile

import numpy as np
import soundfile as sf
from piper import PiperVoice, SynthesisConfig

DUR = 24.0

# Per-line emotion. ls = length_scale (pace, >1 slower), ns = noise_scale (expressiveness),
# nw = noise_w (rhythm variation), st = pitch shift in semitones (formants preserved), db = energy.
# Loanwords use a halant (अप्डेट, डाउन्लोड) so espeak doesn't insert an extra vowel.
LINES = [
    dict(t=0.15, emo='weary, exasperated', ls=0.94, ns=0.72, nw=0.6, st=-1.0, db=0.0,
         text="आमाबुबा नेपालमा हुनुहुन्छ भने, डाक्टरले के भन्नुभयो भनेर थाहा पाउन जासुसी गरेझैं गर्नु नपरोस्।"),
    dict(t=5.6, emo='bright reveal', ls=1.02, ns=0.55, nw=0.4, st=2.0, db=1.5,
         text="प्रस्तुत छ, सन्चो।"),
    dict(t=6.95, emo='warm reassurance', ls=0.95, ns=0.5, nw=0.4, st=0.5, db=0.0,
         text="आमाबुबालाई बारम्बार सोधिरहनु नपरी, व्यावसायिक हेरचाह प्रक्रियामार्फत सधैं जानकारीमा रहनुहोस्।"),
    dict(t=12.6, emo='confident, steady', ls=0.9, ns=0.42, nw=0.3, st=0.5, db=0.5,
         text="हरेक अप्डेटको पछाडि, सन्चोको प्रणालीले निरन्तर हेरचाहको पूरा ख्याल राख्छ, ताकि केही पनि नछुटोस्।"),
    dict(t=18.75, emo='calm, uplifting', ls=1.0, ns=0.55, nw=0.4, st=1.0, db=0.0,
         text="जहाँबाट पनि, ढुक्क भएर जानकारीमा रहनुहोस्।"),
    dict(t=21.75, emo='energetic call to action', ls=0.9, ns=0.6, nw=0.45, st=2.5, db=2.0,
         text="आजै सन्चो डाउन्लोड गर्नुहोस्।"),
]

FILES = {'chitwan': 'ne_NP-chitwan-medium.onnx', 'google': 'ne_NP-google-medium.onnx'}
# crisp, "sharp" vocal chain: clean lows, tame boxiness, presence + air, de-ess, glue compression
VOCAL_CHAIN = (
    'highpass=f=95,'
    'equalizer=f=280:t=q:w=1.2:g=-2.5,'
    'equalizer=f=3400:t=q:w=1.0:g=4,'
    'equalizer=f=7500:t=q:w=0.9:g=2.5,'
    'deesser=i=0.4,'
    'acompressor=threshold=-20dB:ratio=3:attack=4:release=90:makeup=2'
)


def ffmpeg(inp, out, af):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', inp, '-af', af, out], check=True)


def synth(voice, line, speaker, scale):
    cfg = SynthesisConfig(speaker_id=speaker, length_scale=line['ls'] * scale, noise_scale=line['ns'], noise_w_scale=line['nw'])
    return np.concatenate([c.audio_float_array for c in voice.synthesize(line['text'], syn_config=cfg)]).astype(np.float32)


def pitch(x, sr, semitones, tmp):
    if abs(semitones) < 0.01:
        return x
    a, b = os.path.join(tmp, 'p_in.wav'), os.path.join(tmp, 'p_out.wav')
    sf.write(a, x, sr)
    ffmpeg(a, b, f'rubberband=pitch={2 ** (semitones / 12):.5f}:formant=preserved:transients=smooth')
    return sf.read(b, dtype='float32')[0]


def trim(x, sr, thresh=0.01):
    idx = np.nonzero(np.abs(x) > thresh)[0]
    return x if len(idx) == 0 else x[max(0, idx[0] - int(0.01 * sr)) : idx[-1] + int(0.06 * sr)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('voice_dir')
    ap.add_argument('--voice', default='google', choices=FILES)
    ap.add_argument('--speaker', type=int, default=9)
    ap.add_argument('--scale', type=float, default=1.0, help='global pace multiplier (<1 = faster)')
    ap.add_argument('--measure', action='store_true')
    ap.add_argument('--timing', default=None)
    ap.add_argument('--out', default=os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'sancho-chasing-vo-ne.wav'))
    a = ap.parse_args()

    voice = PiperVoice.load(os.path.join(a.voice_dir, FILES[a.voice]))
    sr = voice.config.sample_rate
    speaker = a.speaker if a.voice == 'google' else None
    track = np.zeros(int(DUR * sr), dtype=np.float32)
    spans, prev_end = [], 0.0
    with tempfile.TemporaryDirectory() as tmp:
        for ln in LINES:
            x = synth(voice, ln, speaker, a.scale)
            x = trim(pitch(x, sr, ln['st'], tmp), sr)
            x *= 10 ** (ln['db'] / 20) / max(1e-6, np.abs(x).max())
            length = len(x) / sr
            flag = '  <-- overlaps' if ln['t'] < prev_end - 0.05 else ''
            print(f"{ln['t']:6.2f}s {length:5.2f}s ends {ln['t'] + length:6.2f}s  {ln['emo']}{flag}")
            prev_end = ln['t'] + length
            spans.append((round(ln['t'], 3), round(ln['t'] + length, 3)))
            if not a.measure:
                i0 = int(ln['t'] * sr)
                seg = x[: len(track) - i0]
                track[i0 : i0 + len(seg)] += seg * 0.7
        if a.measure:
            return
        raw = os.path.join(tmp, 'raw.wav')
        sf.write(raw, track, sr)
        ffmpeg(raw, a.out, VOCAL_CHAIN + ',alimiter=limit=0.89')
    print('wrote', os.path.abspath(a.out))
    if a.timing:
        with open(a.timing, 'w') as f:
            f.write('// Generated by scripts/generate_voiceover_ne.py — Nepali speech spans in seconds, used to duck the music.\n')
            f.write('export const VO_SPANS_NE: [number, number][] = [\n')
            for st, en in spans:
                f.write(f'  [{st}, {en}],\n')
            f.write('];\n')
        print('wrote', os.path.abspath(a.timing))


if __name__ == '__main__':
    main()
