"""
Original 80 BPM warm piano + felt pad bed for Rakshya Reel 01 (24s) — synthesized from
scratch, so it is fully license-free. 1 beat = 0.75s = 22.5 video frames; 1 bar = 90 frames.
Hits are placed on the reel's scene timeline (src/rakshya/theme.ts → R).

    npm run bgm:rakshya    # -> public/audio/rakshya-reel01-bgm.mp3

Shape (bars of 3s):
  0  Dm9      pad breathes in, sparse piano            "carry their fear in silence"
  1  B♭maj7   sparse piano
  2  Gm9      piano thins to held dyads, low D at 5s    "Silence is not safety"
  3  Asus4→A  held tension; soft bell at 11.2s          "रक्षा" appears
  4  Fmaj7    flowing arpeggio — the turn to major      community / helplines
  5  B♭maj9   flowing arpeggio                          tools for Nepal
  6  Fmaj9    warm bloom on the 18s downbeat            "Every woman. Every child."
  7  B♭/F→F   resolve and fade to rest                  lockup & CTA
"""
import os
import wave

import numpy as np

SR = 44100
DUR = 24.0
N = int(SR * DUR)
BPM = 80
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(1145)
piano = np.zeros((N, 2))
pad = np.zeros((N, 2))
bells = np.zeros((N, 2))

NAMES = {'C': -9, 'C#': -8, 'Db': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}


def hz(note):
    return 440.0 * 2 ** ((NAMES[note[:-1]] + (int(note[-1]) - 4) * 12) / 12)


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def put(bus, sig, t0, pan=0.0, gain=1.0):
    i0 = int(round(t0 * SR))
    if i0 >= N:
        return
    sig = sig[: N - i0] * gain
    bus[i0 : i0 + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4)
    bus[i0 : i0 + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4)


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same')


# ------------------------------------------------------------------ instruments
def piano_note(note, vel=0.6, length=4.5):
    """Soft felt piano: inharmonic partials, pitch-dependent decay, velocity-dependent brightness."""
    f = hz(note)
    t = tt(length)
    base = np.interp(f, [80, 1000], [3.6, 1.3])
    s = np.zeros_like(t)
    for k in range(1, 9):
        fk = k * f * np.sqrt(1 + 0.00035 * k * k)
        if fk > 9000:
            break
        amp = (1 / k ** 1.35) * (vel ** (0.4 * (k - 1)))  # quieter touch = darker tone
        dec = base / k ** 0.75
        s += amp * np.exp(-t / dec) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    s += 0.004 * lp(rng.standard_normal(len(t)), 6) * np.exp(-t / 0.012)  # felt hammer
    s *= np.minimum(1, t / 0.006)  # attack
    s *= np.minimum(1, (length - t) / 0.4)  # release tail
    return s * vel * 0.32


def pad_chord(notes, t0, length, gain=0.07, attack=1.4, release=1.6):
    t = tt(length + release)
    env = np.minimum(1, t / attack) * np.clip((length + release - t) / release, 0, 1)
    env = env ** 1.5
    for i, n in enumerate(notes):
        f = hz(n)
        s = np.zeros_like(t)
        for det in (-0.12, 0.0, 0.13):  # three gently detuned voices (cents-ish wobble)
            ff = f * 2 ** (det / 12 * 0.3)
            s += np.sin(2 * np.pi * ff * t + rng.uniform(0, 6.28)) + 0.18 * np.sin(4 * np.pi * ff * t)
        s *= 1 + 0.06 * np.sin(2 * np.pi * 0.21 * t + i)  # slow breathing
        put(pad, s * env, t0, pan=(i / max(1, len(notes) - 1) - 0.5) * 0.7, gain=gain / 3)


def bell(note, t0, gain=0.12, pan=0.25):
    f = hz(note)
    t = tt(4.0)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / 1.8) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.6)
         + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / 0.25))
    s *= np.minimum(1, t / 0.004)
    put(bells, s, t0, pan=pan, gain=gain)


def p(note, beat, vel=0.55, pan=None):
    if pan is None:
        pan = np.clip((hz(note) - 260) / 600, -0.5, 0.5)
    put(piano, piano_note(note, vel), beat * BEAT + rng.uniform(0, 0.012), pan=pan)


# ------------------------------------------------------------------ score
CHORDS = [
    ['D3', 'A3', 'C4', 'E4', 'F4'],  # Dm9
    ['Bb2', 'F3', 'A3', 'D4'],  # Bbmaj7
    ['G2', 'D3', 'F3', 'A3', 'Bb3'],  # Gm9
    ['A2', 'E3', 'A3', 'D4', 'E4'],  # Asus4
    ['F2', 'C3', 'E3', 'A3', 'C4'],  # Fmaj7
    ['Bb2', 'F3', 'A3', 'C4', 'D4'],  # Bbmaj9
    ['F2', 'C3', 'E3', 'G3', 'A3'],  # Fmaj9
    ['F2', 'C3', 'F3', 'A3', 'C4'],  # F
]
for b, ch in enumerate(CHORDS):
    pad_chord(ch, b * BAR - (0.6 if b else 0), BAR + (0.6 if b else 0), gain=0.075 if b < 6 else 0.09)
# low sub under the "silence" line at 5s, and the bloom at 18s
pad_chord(['D2'], 5.0, 6.0, gain=0.06, attack=0.8)
pad_chord(['F1'], 18.0, 5.0, gain=0.05, attack=0.5)

# bar 0–1: sparse, intimate
for beat, n, v in [(0, 'D3', 0.5), (0, 'A3', 0.42), (1.5, 'F4', 0.4), (2, 'E4', 0.36), (3, 'C5', 0.32),
                   (4, 'Bb2', 0.48), (4, 'F3', 0.4), (5.5, 'D4', 0.38), (6, 'A4', 0.36), (7, 'F4', 0.3)]:
    p(n, beat, v)
# bar 2–3: thins to held dyads (silence)
for beat, n, v in [(8, 'G2', 0.42), (8, 'D4', 0.34), (8, 'Bb3', 0.3), (10.5, 'A4', 0.26),
                   (12, 'A2', 0.4), (12, 'D4', 0.3), (12, 'E4', 0.28), (14.5, 'C#4', 0.32), (14.5, 'E4', 0.26)]:
    p(n, beat, v)
bell('A5', 11.2, gain=0.11, pan=0.2)  # "रक्षा"
bell('E6', 11.2 + BEAT * 0.5, gain=0.05, pan=0.35)
# bar 4–5: flowing eighth-note arpeggios — the hand held out
ARP = {4: ['F2', 'C3', 'A3', 'C4', 'E4', 'C4', 'A3', 'G4'], 5: ['Bb2', 'F3', 'A3', 'C4', 'D4', 'C4', 'A3', 'F4']}
for b, notes in ARP.items():
    for i, n in enumerate(notes):
        p(n, b * 4 + i * 0.5, 0.42 + 0.08 * (i == 0) + 0.03 * np.sin(i))
# melody line on top of the major turn
for beat, n in [(16, 'A4'), (17.5, 'C5'), (19, 'E5'), (20, 'D5'), (21.5, 'C5'), (23, 'A4')]:
    p(n, beat, 0.4)
# bar 6: bloom on the downbeat (18s)
for n, v in [('F2', 0.6), ('C3', 0.5), ('A3', 0.45), ('E4', 0.42), ('G4', 0.4), ('C5', 0.42)]:
    p(n, 24, v)
for beat, n in [(25.5, 'A4'), (26, 'G4'), (27, 'E5')]:
    p(n, beat, 0.36)
bell('C6', 24 * BEAT + 0.02, gain=0.05, pan=-0.2)
# bar 7: resolve and rest
for n, v in [('F2', 0.45), ('C3', 0.38), ('F3', 0.35), ('A3', 0.35), ('C4', 0.33), ('F4', 0.32)]:
    p(n, 28, v)
p('A4', 29.5, 0.28)
p('C5', 30.5, 0.24)


# ------------------------------------------------------------------ room + master
def reverb(x, seconds=3.2, seed=0):
    r = np.random.default_rng(seed)
    t = tt(seconds)
    ir = r.standard_normal(len(t)) * np.exp(-t / (seconds / 6.5))
    ir = lp(ir, 9)
    ir[: int(0.018 * SR)] = 0  # pre-delay
    ir /= np.sqrt(np.sum(ir ** 2))
    n = len(x) + len(ir)
    size = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return y


dry = piano * 1.0 + pad * 1.0 + bells
wet = np.stack([reverb(dry[:, 0], seed=1), reverb(dry[:, 1], seed=2)], axis=1)
mix = dry * 0.78 + wet * 0.42
mix[:, 0] = lp(mix[:, 0], 3)  # take the edge off — warm, no sparkle-harsh highs
mix[:, 1] = lp(mix[:, 1], 3)
t = np.arange(N) / SR
mix *= np.clip(t / 0.4, 0, 1)[:, None] * np.clip((DUR - t) / 1.4, 0, 1)[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)  # very gentle glue
mix *= 0.79 / np.max(np.abs(mix))  # ≈ -2 dBFS peak

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'rakshya-reel01-bgm.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.normpath(out))
