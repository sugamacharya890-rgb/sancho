"""
Original 88 BPM warm indie-ambient bed for Rakshya Reel 03 (24s): plucked arpeggios, a warm
pad, a soft kick/shaker rhythm that builds step by step, and a felt-piano bloom on the lockup.
Synthesized from scratch — license-free.

    npm run bgm:rakshya03    # -> public/audio/rakshya-reel03-bgm.mp3

The beat grid is offset so grid beat 24 (bar 7's downbeat) lands on 18.0s = frame 540.
Cue beats mirror CUES3 in src/rakshya/reel03/timeline.ts — keep them in sync.

  intro  Dmaj9    pad + plucks                         "Protection that fits in your palm."
  1      Bm7      pluck per moment card (beats 1–4)
  2      Gmaj7
  3      D/F#     kick + shaker enter at 6s; step plucks  "Simple steps. Real safety."
  4      Em7→A    steps 03, 04
  5      Gmaj9    full groove, pillars                  "Every woman. Every child. Every school."
  6      Bm7→A    77-district shimmer
  7      Dadd9    bloom at 18s                          lockup · "See what's coming."
  8      G/D→D    rest
"""
import os
import wave

import numpy as np

SR = 44100
DUR = 24.0
N = int(SR * DUR)
BPM = 88
BEAT = 60 / BPM
BAR = 4 * BEAT
G0 = 18.0 - 24 * BEAT  # time of grid beat 0
rng = np.random.default_rng(77)
plk = np.zeros((N, 2))
pad = np.zeros((N, 2))
drums = np.zeros((N, 2))
keys = np.zeros((N, 2))

NAMES = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}
CUE_BEATS = {'moments': [1, 2, 3, 4], 'steps': [9, 11, 13, 15], 'pillars': [18, 19, 20], 'districts': 21, 'close': 24}


def hz(n):
    return 440.0 * 2 ** ((NAMES[n[:-1]] + (int(n[-1]) - 4) * 12) / 12)


def tb(beat):
    """Time (s) of grid beat `beat` (fractional allowed)."""
    return G0 + beat * BEAT


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def put(bus, sig, t0, pan=0.0, gain=1.0):
    i0 = int(round(t0 * SR))
    if i0 < 0:
        sig, i0 = sig[-i0:], 0
    if i0 >= N:
        return
    sig = sig[: N - i0] * gain
    bus[i0 : i0 + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4)
    bus[i0 : i0 + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4)


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same')


# ------------------------------------------------------------------ instruments
def pluck(note, t0, vel=0.5, pan=None, bright=0.55):
    """Warm plucked string: higher partials die faster, a touch of body resonance."""
    f = hz(note)
    t = tt(2.2)
    dec = np.interp(f, [100, 1200], [1.6, 0.6])
    s = np.zeros_like(t)
    for k in range(1, 10):
        fk = k * f * (1 + 0.0004 * k * k)
        if fk > 8000:
            break
        s += (bright ** (k - 1)) / k * np.exp(-t * k ** 0.9 / dec) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    s += 0.012 * lp(rng.standard_normal(len(t)), 3) * np.exp(-t / 0.003)
    s *= np.minimum(1, t / 0.002)
    if pan is None:
        pan = np.clip((f - 330) / 700, -0.45, 0.45)
    put(plk, s, t0 + rng.uniform(0, 0.006), pan, vel * 0.25)


def piano(note, t0, vel=0.5):
    f = hz(note)
    t = tt(4.5)
    base = np.interp(f, [80, 1000], [3.4, 1.3])
    s = np.zeros_like(t)
    for k in range(1, 8):
        fk = k * f * np.sqrt(1 + 0.00035 * k * k)
        s += (1 / k ** 1.35) * vel ** (0.4 * (k - 1)) * np.exp(-t / (base / k ** 0.75)) * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6.28))
    s *= np.minimum(1, t / 0.006) * np.minimum(1, (4.5 - t) / 0.4)
    put(keys, s, t0 + rng.uniform(0, 0.015), np.clip((f - 260) / 600, -0.45, 0.45), vel * 0.3)


def pad_chord(notes, t0, length, gain=0.07, attack=0.9, release=1.3):
    t = tt(length + release)
    env = (np.minimum(1, t / attack) * np.clip((length + release - t) / release, 0, 1)) ** 1.5
    for i, n in enumerate(notes):
        f = hz(n)
        s = sum(np.sin(2 * np.pi * f * 2 ** (d / 1200) * t + rng.uniform(0, 6.28)) for d in (-7, 0, 6)) / 3
        s += 0.15 * np.sin(4 * np.pi * f * t)
        put(pad, s * env, t0, (i / max(1, len(notes) - 1) - 0.5) * 0.7, gain)


def kick(t0, gain=0.2):
    t = tt(0.32)
    f = 50 + 55 * np.exp(-t / 0.028)
    put(drums, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.13), t0, 0, gain)


def shaker(t0, gain=0.025, pan=0.3):
    t = tt(0.12)
    s = np.diff(rng.standard_normal(len(t)), prepend=0) * np.exp(-t / 0.03) * np.minimum(1, t / 0.008)
    put(drums, s, t0, pan, gain)


def rim(t0, gain=0.05):
    t = tt(0.08)
    s = (np.sin(2 * np.pi * 1650 * t) + 0.5 * np.sin(2 * np.pi * 2900 * t)) * np.exp(-t / 0.012)
    put(drums, s, t0, -0.15, gain)


# ------------------------------------------------------------------ harmony (bar k starts at beat 4k)
CH = {
    -1: ['D3', 'A3', 'C#4', 'E4', 'F#4'],  # intro Dmaj9 (partial bar before grid beat 0)
    0: ['D3', 'A3', 'C#4', 'E4', 'F#4'],  # Dmaj9
    1: ['B2', 'F#3', 'A3', 'D4'],  # Bm7
    2: ['G2', 'D3', 'F#3', 'B3', 'D4'],  # Gmaj7
    3: ['F#2', 'D3', 'A3', 'D4', 'F#4'],  # D/F#
    4: ['E2', 'B2', 'D3', 'G3', 'B3'],  # Em7 (→ A at beat 2)
    5: ['G2', 'D3', 'F#3', 'A3', 'B3'],  # Gmaj9
    6: ['B2', 'F#3', 'A3', 'D4'],  # Bm7 (→ Asus4/A)
    7: ['D3', 'A3', 'E4', 'F#4', 'A4'],  # Dadd9 — the lockup
    8: ['D3', 'G3', 'B3', 'D4'],  # G/D → D
}
pad_chord(CH[-1], 0, G0 + 0.3, attack=0.5)
for k in range(0, 9):
    t0 = tb(4 * k)
    if t0 >= DUR:
        break
    if k in (4, 6):
        pad_chord(CH[k], t0 - 0.25, BAR / 2 + 0.25)
        pad_chord(['A2', 'E3', 'A3', 'C#4' if k == 4 else 'D4', 'E4'], tb(4 * k + 2) - 0.15, BAR / 2 + 0.15)
    else:
        pad_chord(CH[k], t0 - 0.25, min(BAR, DUR - t0) + 0.25, gain=0.085 if k >= 7 else 0.07)

# plucked eighth-note arpeggio (quarter notes until the steps begin)
ARP = {0: ['D4', 'A4', 'F#4', 'E5'], 1: ['B3', 'F#4', 'D4', 'A4'], 2: ['G3', 'D4', 'B3', 'F#4'], 3: ['F#3', 'D4', 'A3', 'F#4'],
       4: ['E3', 'B3', 'G3', 'E4'], 5: ['G3', 'D4', 'B3', 'A4'], 6: ['B3', 'F#4', 'D4', 'A4'], 7: ['D4', 'A4', 'F#4', 'E5'], 8: ['D4', 'G4', 'B4', 'D5']}
for b in range(-2, 0):  # pickup before grid beat 0
    if tb(b) >= 0:
        pluck(['A4', 'F#4'][b + 2], tb(b), 0.28)
for beat in range(0, 34):
    k = beat // 4
    if k > 8 or tb(beat) > DUR - 1.2:
        break
    notes = ARP[k]
    if k in (4, 6) and beat % 4 >= 2:
        notes = ['A3', 'E4', 'C#4', 'E4'] if k == 4 else ['A3', 'E4', 'D4', 'E4']
    pluck(notes[beat % 4], tb(beat), 0.34 if beat % 4 == 0 else 0.26)
    if tb(beat) >= 6.0:  # eighth-note motion from the steps onward
        pluck(notes[(beat + 2) % 4], tb(beat + 0.5), 0.17, bright=0.45)

# rhythm builds: kick + shaker from 6s, rim + fuller kick from 13s, eases at the bloom
for beat in range(0, 34):
    t = tb(beat)
    if t < 6.0 or t > DUR - 1.3:
        continue
    full = t >= 13.0
    if beat % 2 == 0 or (full and beat % 4 == 3):
        kick(t, 0.2 if beat % 4 == 0 else 0.14)
    shaker(t + BEAT / 2, 0.026)
    if full:
        shaker(t, 0.016, -0.3)
        if beat % 4 in (1, 3):
            rim(t, 0.035)

# ------------------------------------------------------------------ cue notes (sync to UI)
for b, n in zip(CUE_BEATS['moments'], ['F#5', 'A5', 'B5', 'D6']):
    pluck(n, tb(b), 0.42, pan=0.15, bright=0.6)
for b, n in zip(CUE_BEATS['steps'], ['D5', 'F#5', 'A5', 'D6']):
    pluck(n, tb(b), 0.5, pan=0.1, bright=0.62)
for b, n in zip(CUE_BEATS['pillars'], ['B4', 'D5', 'F#5']):
    pluck(n, tb(b), 0.45, pan=-0.1)
for i in range(8):  # light shimmer while the 77 districts fill
    pluck(['A5', 'B5', 'D6', 'E6'][i % 4], tb(CUE_BEATS['districts'] + i * 0.25), 0.16, pan=0.35 - i * 0.08, bright=0.4)
for n, v in [('D2', 0.55), ('A2', 0.5), ('F#3', 0.45), ('E4', 0.42), ('A4', 0.4), ('D5', 0.42), ('F#5', 0.36)]:
    piano(n, tb(CUE_BEATS['close']), v)
for b, n in [(25.5, 'A5'), (26, 'F#5'), (27, 'E5')]:
    piano(n, tb(b), 0.3)
for n, v in [('D3', 0.38), ('A3', 0.34), ('F#4', 0.32), ('D5', 0.3)]:
    piano(n, tb(30), v)


# ------------------------------------------------------------------ room + master
def reverb(x, seconds=2.4, seed=0):
    r = np.random.default_rng(seed)
    t = tt(seconds)
    ir = lp(r.standard_normal(len(t)) * np.exp(-t / (seconds / 6)), 9)
    ir[: int(0.014 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << (len(x) + len(ir) - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]


dry = plk + pad + keys + drums
send = plk + pad + keys + drums * 0.25
wet = np.stack([reverb(send[:, 0], seed=1), reverb(send[:, 1], seed=2)], axis=1)
mix = dry * 0.8 + wet * 0.34
mix[:, 0] = lp(mix[:, 0], 3)
mix[:, 1] = lp(mix[:, 1], 3)
t = np.arange(N) / SR
mix *= np.clip(t / 0.2, 0, 1)[:, None] * np.clip((DUR - t) / 1.2, 0, 1)[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix *= 0.79 / np.max(np.abs(mix))

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'rakshya-reel03-bgm.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.normpath(out))
