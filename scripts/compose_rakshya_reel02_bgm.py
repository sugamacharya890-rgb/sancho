"""
Original 82 BPM lo-fi acoustic bed for Rakshya Reel 02 (24s): soft marimba pulse, warm pad,
a hushed brushed groove and a felt-piano resolution. Synthesized from scratch — license-free.

    npm run bgm:rakshya02    # -> public/audio/rakshya-reel02-bgm.mp3

The bar grid is offset so bar 7's downbeat lands on 19.0s (frame 570, the closing card).
Cue times mirror CUES in src/rakshya/reel02/timeline.ts — keep them in sync.

  intro  Cmaj9   pad + quarter-note marimba             "Where do you turn in seconds?"
  1      Am9     one note per helpline row (62–95f)
  2      Fmaj7   two-note chime on the 1145 tap (140f)
  3      C/E     brushed groove enters at 6s            "You are heard. You are believed."
  4      Dm9→G   share tap + three rising step notes
  5      Fmaj9   quick-exit chime (474f); groove rests  "Discreet. Built for real life."
  6      Am7→G   groove returns, lifting
  7      Cadd9   resolution bloom at 19s                "Help & community in one place."
  8      F/C→C   rest
"""
import os
import wave

import numpy as np

SR = 44100
DUR = 24.0
N = int(SR * DUR)
BPM = 82
BEAT = 60 / BPM
BAR = 4 * BEAT
OFF = 19.0 - 6 * BAR  # bar 1 starts here; bar 7 = 19.0s
rng = np.random.default_rng(1098)
mar = np.zeros((N, 2))
pad = np.zeros((N, 2))
drums = np.zeros((N, 2))
keys = np.zeros((N, 2))

NAMES = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}
CUES = {'hubRows': [62, 73, 84, 95], 'hubTap': 140, 'postTap': 318, 'steps': [330, 348, 366], 'exitTap': 474, 'close': 570}


def hz(n):
    return 440.0 * 2 ** ((NAMES[n[:-1]] + (int(n[-1]) - 4) * 12) / 12)


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def bar(k, beat=0.0):
    return OFF + (k - 1) * BAR + beat * BEAT


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
def marimba(note, t0, vel=0.5, pan=None):
    f = hz(note)
    t = tt(1.8)
    dec = np.interp(f, [150, 1200], [0.9, 0.35])
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / dec)
         + 0.22 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / (dec * 0.18))
         + 0.05 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / 0.02))
    s += 0.01 * lp(rng.standard_normal(len(t)), 4) * np.exp(-t / 0.004)  # soft rubber mallet
    s *= np.minimum(1, t / 0.003)
    if pan is None:
        pan = np.clip((f - 400) / 700, -0.45, 0.45)
    put(mar, s, t0 + rng.uniform(0, 0.008), pan, vel * 0.22)


def chime(note, t0, gain=0.1, pan=0.2):
    f = hz(note)
    t = tt(3.0)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 1.4) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.45)
    put(mar, s * np.minimum(1, t / 0.004), t0, pan, gain)


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


def pad_chord(notes, t0, length, gain=0.07, attack=1.0, release=1.4):
    t = tt(length + release)
    env = (np.minimum(1, t / attack) * np.clip((length + release - t) / release, 0, 1)) ** 1.5
    for i, n in enumerate(notes):
        f = hz(n)
        s = sum(np.sin(2 * np.pi * f * 2 ** (d / 1200) * t + rng.uniform(0, 6.28)) for d in (-6, 0, 7)) / 3
        s += 0.15 * np.sin(4 * np.pi * f * t)
        # gentle eighth-note "pulse" in the pad (soft sidechain feel)
        s *= 1 - 0.12 * (0.5 + 0.5 * np.cos(2 * np.pi * (t + t0 - OFF) / (BEAT / 2)))
        put(pad, s * env, t0, (i / max(1, len(notes) - 1) - 0.5) * 0.7, gain)


def kick(t0, gain=0.22):
    t = tt(0.35)
    f = 52 + 50 * np.exp(-t / 0.03)
    put(drums, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14), t0, 0, gain)


def brush(t0, gain=0.03, pan=0.25):
    t = tt(0.16)
    s = np.diff(rng.standard_normal(len(t)), prepend=0) * np.exp(-t / 0.045) * np.minimum(1, t / 0.012)
    put(drums, lp(s, 3), t0, pan, gain)


# ------------------------------------------------------------------ harmony
CH = {
    0: ['C3', 'G3', 'B3', 'D4', 'E4'],  # intro Cmaj9
    1: ['A2', 'E3', 'G3', 'B3', 'C4'],  # Am9
    2: ['F2', 'C3', 'E3', 'A3', 'C4'],  # Fmaj7
    3: ['E2', 'C3', 'G3', 'C4', 'E4'],  # C/E
    4: ['D3', 'A3', 'C4', 'E4', 'F4'],  # Dm9 (→ G at beat 3)
    5: ['F2', 'C3', 'E3', 'G3', 'A3'],  # Fmaj9
    6: ['A2', 'E3', 'G3', 'C4', 'E4'],  # Am7 (→ Gsus4/G)
    7: ['C3', 'G3', 'D4', 'E4', 'G4'],  # Cadd9
    8: ['C3', 'F3', 'A3', 'C4', 'E4'],  # F/C → C
}
pad_chord(CH[0], 0, OFF + 0.4, gain=0.07, attack=0.6)
for k in range(1, 9):
    length = BAR if k < 8 else DUR - bar(8)
    if k in (4, 6):
        pad_chord(CH[k], bar(k) - 0.3, BAR / 2 + 0.3, gain=0.07)
        pad_chord(['G2', 'D3', 'G3', 'C4' if k == 6 else 'B3', 'D4'], bar(k, 2) - 0.2, BAR / 2 + 0.2, gain=0.07)
    else:
        pad_chord(CH[k], bar(k) - 0.3, length + 0.3, gain=0.085 if k >= 7 else 0.07)

# marimba pulse: quarters in the intro + bar 1–2, eighths once the groove is in
PULSE = {0: ['C5', 'G4', 'E5', 'G4'], 1: ['A4', 'E4', 'C5', 'E4'], 2: ['A4', 'F4', 'C5', 'F4'], 3: ['G4', 'E4', 'C5', 'E4'],
         4: ['F4', 'A4', 'G4', 'B4'], 5: ['A4', 'F4', 'C5', 'E5'], 6: ['C5', 'A4', 'B4', 'D5'], 7: ['E5', 'G4', 'D5', 'G4'], 8: ['C5', 'G4', 'E5', 'C5']}
for b in range(4):
    marimba(PULSE[0][b], OFF - BAR + b * BEAT, 0.35) if OFF - BAR + b * BEAT >= 0 else None
for k in range(1, 9):
    for b in range(4):
        n = PULSE[k][b]
        t = bar(k, b)
        if t >= DUR - 1.0 or (5 <= k <= 5 and 15.8 < t < 16.5):
            continue
        marimba(n, t, 0.4 if b == 0 else 0.3)
        if k >= 3 and k != 5:  # off-beat answer an octave-ish down
            marimba(PULSE[k][(b + 2) % 4], t + BEAT / 2, 0.18)

# brushed groove: 6s → quick exit, then back for bar 6 second half → end
def groove(t_from, t_to):
    k = 1
    while bar(k) < t_to:
        for b in range(4):
            t = bar(k, b)
            if t_from <= t < t_to:
                if b in (0, 2):
                    kick(t, 0.2 if b == 0 else 0.15)
                brush(t + BEAT / 2, 0.028, 0.3)
                brush(t, 0.018 + 0.012 * (b in (1, 3)), -0.25)
        k += 1


groove(6.0, CUES['exitTap'] / 30)
groove(bar(6, 2), DUR - 1.2)

# ------------------------------------------------------------------ cue notes (sync to UI touches)
for f, n in zip(CUES['hubRows'], ['A4', 'C5', 'E5', 'G5']):
    marimba(n, f / 30, 0.55, pan=0.1)
chime('A5', CUES['hubTap'] / 30, 0.09)
chime('C6', CUES['hubTap'] / 30 + BEAT / 2, 0.06, pan=0.3)
marimba('F5', CUES['postTap'] / 30, 0.55)
for f, n in zip(CUES['steps'], ['D5', 'F5', 'A5']):
    marimba(n, f / 30, 0.5, pan=0.15)
chime('C6', CUES['exitTap'] / 30, 0.08, pan=-0.15)
chime('E6', CUES['exitTap'] / 30 + BEAT / 2, 0.05, pan=0.2)
# resolution bloom at 19s
for n, v in [('C2', 0.55), ('G2', 0.5), ('E3', 0.45), ('D4', 0.42), ('G4', 0.4), ('C5', 0.42), ('E5', 0.36)]:
    piano(n, CUES['close'] / 30, v)
for b, n in [(1.5, 'G5'), (2, 'E5'), (3, 'D5')]:
    piano(n, bar(7, b), 0.32)
for n, v in [('C3', 0.4), ('G3', 0.35), ('E4', 0.32), ('C5', 0.3)]:
    piano(n, bar(8, 2), v)


# ------------------------------------------------------------------ room + master
def reverb(x, seconds=2.6, seed=0):
    r = np.random.default_rng(seed)
    t = tt(seconds)
    ir = lp(r.standard_normal(len(t)) * np.exp(-t / (seconds / 6)), 9)
    ir[: int(0.015 * SR)] = 0
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << (len(x) + len(ir) - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]


dry = mar + pad + keys + drums
send = mar * 0.9 + pad + keys + drums * 0.3
wet = np.stack([reverb(send[:, 0], seed=1), reverb(send[:, 1], seed=2)], axis=1)
mix = dry * 0.8 + wet * 0.36
mix[:, 0] = lp(mix[:, 0], 3)
mix[:, 1] = lp(mix[:, 1], 3)
t = np.arange(N) / SR
mix *= np.clip(t / 0.25, 0, 1)[:, None] * np.clip((DUR - t) / 1.2, 0, 1)[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix *= 0.79 / np.max(np.abs(mix))

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'rakshya-reel02-bgm.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.normpath(out))
