"""
Original 120 bpm background track for the 22s Sancho promo — synthesized from scratch,
so it is fully license-free. One beat = 15 video frames; every hit is placed on the
video's scene timeline (see src/promo/theme.ts and the scene constants).

    python3 scripts/compose_promo_bgm.py   # -> public/audio/sancho-promo-bgm.wav
"""
import os
import wave

import numpy as np

SR = 44100
DUR = 22.0
N = int(SR * DUR)
BPM = 120
B = 60 / BPM  # beat = 0.5 s = 15 frames
rng = np.random.default_rng(11)
drums = np.zeros((N, 2))
music = np.zeros((N, 2))
fx = np.zeros((N, 2))


def fr(frame):
    return frame / 30


def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}
    return 440.0 * 2 ** ((names[note[:-1]] + (int(note[-1]) - 4) * 12) / 12)


def put(bus, sig, t0, pan=0.0, gain=1.0):
    i0 = int(round(t0 * SR))
    if i0 < 0:
        sig = sig[-i0:]
        i0 = 0
    if i0 >= N:
        return
    sig = sig[: N - i0] * gain
    bus[i0 : i0 + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4)
    bus[i0 : i0 + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4)


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def hp(x):  # crude high-pass: first difference
    return np.diff(x, prepend=0)


def lp(x, k):  # crude low-pass: moving average
    return np.convolve(x, np.ones(k) / k, mode='same')


# ------------------------------------------------------------------ instruments
def kick(t0, gain=0.9):
    t = tt(0.45)
    f = 48 + 115 * np.exp(-t / 0.035)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.16)
    s[:200] += rng.standard_normal(200) * np.linspace(0.5, 0, 200)  # click
    put(drums, s, t0, 0, gain)


def clap(t0, gain=0.35):
    t = tt(0.3)
    n = hp(lp(rng.standard_normal(len(t)), 3))
    e = np.zeros(len(t))
    for d in (0, 0.011, 0.022):
        e += np.where(t >= d, np.exp(-(t - d) / 0.008), 0)
    e += np.where(t >= 0.03, np.exp(-(t - 0.03) / 0.07) * 0.6, 0)
    put(drums, n * e, t0, 0.1, gain)


def hat(t0, open_=False, gain=0.12, pan=0.25):
    t = tt(0.25 if open_ else 0.06)
    s = hp(hp(rng.standard_normal(len(t)))) * np.exp(-t / (0.06 if open_ else 0.012))
    put(drums, s, t0, pan, gain)


def snare(t0, gain=0.3):
    t = tt(0.2)
    s = hp(rng.standard_normal(len(t))) * np.exp(-t / 0.05) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04)
    put(drums, s, t0, -0.05, gain)


def pluck(note, t0, gain=0.15, decay=0.28, pan=0.0, bright=0.5, bus=None):
    f = hz(note)
    t = tt(decay * 4)
    s = np.zeros(len(t))
    for k in range(1, 7):
        s += (bright ** (k - 1)) / k * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t / decay * (1 + 0.5 * (k - 1)))
    s *= np.minimum(1, t / 0.003)
    put(music if bus is None else bus, s, t0, pan, gain)


def bass(note, t0, length=0.22, gain=0.32):
    f = hz(note)
    t = tt(length + 0.08)
    s = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 6)) * np.exp(-t / (length * 0.9))
    s *= np.minimum(1, t / 0.004) * np.minimum(1, (length + 0.08 - t) / 0.02)
    put(music, s, t0, 0, gain)


def pad(notes, t0, t1, gain=0.05):
    t = tt(t1 - t0 + 0.6)
    s = np.zeros(len(t))
    for n in notes:
        for det in (-0.08, 0.08):
            s += np.sin(2 * np.pi * hz(n) * 2 ** (det / 12) * t + rng.uniform(0, 6))
    s *= np.minimum(1, t / 0.25) * np.clip((t1 - t0 + 0.6 - t) / 0.6, 0, 1)
    put(music, s / (2 * len(notes)), t0, 0, gain)


def bell(note, t0, gain=0.12, decay=1.2, pan=0.0):
    f = hz(note)
    t = tt(decay * 4)
    s = (np.sin(2 * np.pi * f * t) * np.exp(-t / decay) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / (decay * 0.35))
         + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t / (decay * 0.15)))
    put(fx, s * np.minimum(1, t / 0.002), t0, pan, gain)


def whoosh(t_peak, length=0.6, gain=0.18, up=True):
    t = tt(length)
    n = lp(rng.standard_normal(len(t)), 6)
    e = np.sin(np.clip(t / length, 0, 1) * np.pi) ** 2
    s = hp(n) * e if up else n * e
    put(fx, s, t_peak - length * 0.6, 0, gain)


def riser(t_end, length=1.0, gain=0.14):
    t = tt(length)
    f = 220 * 2 ** (3 * t / length)
    s = 0.4 * np.sin(2 * np.pi * np.cumsum(f) / SR) + hp(rng.standard_normal(len(t))) * 0.7
    put(fx, s * (t / length) ** 2, t_end - length, 0, gain)


def crash(t0, gain=0.2):
    t = tt(1.8)
    put(fx, hp(hp(rng.standard_normal(len(t)))) * np.exp(-t / 0.5), t0, 0, gain)


def impact(t0, gain=0.6):
    t = tt(1.2)
    f = 38 + 70 * np.exp(-t / 0.05)
    put(fx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35), t0, 0, gain)


# ------------------------------------------------------------------ harmony + hook
PROG = [  # vi – IV – I – V, one chord per bar (2 s)
    ('A2', ['A3', 'C4', 'E4']),
    ('F2', ['F3', 'A3', 'C4']),
    ('C2', ['G3', 'C4', 'E4']),
    ('G2', ['G3', 'B3', 'D4']),
]
HOOK = [  # 8th-note lead hook, 4 bars (None = rest)
    ['E5', None, 'A5', None, 'G5', 'E5', None, 'D5'],
    ['C5', None, 'D5', 'E5', None, None, 'C5', None],
    ['E5', None, 'G5', None, 'A5', 'G5', None, 'E5'],
    ['D5', None, None, 'B4', 'D5', None, 'G5', None],
]


def bar_of(t):
    return int(t // (4 * B))


def chords_and_bass(t0, t1, stabs=True, bass_on=True, pad_gain=0.05):
    b = bar_of(t0 + 1e-6)
    t = b * 4 * B
    while t < t1 - 1e-6:
        root, ch = PROG[b % 4]
        s, e = max(t, t0), min(t + 4 * B, t1)
        pad(ch, s, e, pad_gain)
        for k in range(8):  # 8ths
            tk = t + k * B / 2
            if tk < t0 - 1e-6 or tk >= t1 - 1e-6:
                continue
            if bass_on and k in (0, 3, 4, 6, 7):
                bass(root if k != 6 else root[:-1] + str(int(root[-1]) + 1), tk, gain=0.3 if k == 0 else 0.22)
            if stabs and k in (1, 3, 6):  # off-beat chord stabs
                for n in ch:
                    up = n[:-1] + str(int(n[-1]) + 1)
                    pluck(up, tk, gain=0.05, decay=0.12, pan=0.35 if k % 2 else -0.35, bright=0.6)
        b += 1
        t = b * 4 * B


def hook(t0, t1, gain=0.11):
    b = bar_of(t0 + 1e-6)
    t = b * 4 * B
    while t < t1 - 1e-6:
        for k, n in enumerate(HOOK[b % 4]):
            tk = t + k * B / 2
            if n and t0 - 1e-6 <= tk < t1 - 1e-6:
                pluck(n, tk, gain=gain, decay=0.22, pan=0.15 * np.sin(k), bright=0.55)
                pluck(n, tk + 3 * B / 4, gain=gain * 0.25, decay=0.2, pan=-0.5)  # dotted-8th echo
        b += 1
        t = b * 4 * B


def groove(t0, t1, kick_on=True, clap_on=True, hats='16', gain=1.0):
    t = t0
    i = 0
    while t < t1 - 1e-6:
        beat_in_bar = int(round(t / B)) % 4
        if kick_on:
            kick(t, 0.9 * gain)
        if clap_on and beat_in_bar in (1, 3):
            clap(t, 0.33 * gain)
        if hats == '16':
            for s in range(4):
                hat(t + s * B / 4, open_=(s == 2), gain=(0.09 if s % 2 else 0.06) * gain, pan=0.3 if s % 2 else -0.2)
        elif hats == '8':
            hat(t + B / 2, gain=0.08 * gain)
        t += B
        i += 1


# ------------------------------------------------------------------ arrangement
# HOOK (0 – 3.0s): instant hook, light beat
hook(0.0, 3.0)
chords_and_bass(0.0, 3.0, stabs=False, bass_on=False, pad_gain=0.06)
groove(0.0, 3.0, kick_on=True, clap_on=True, hats='8', gain=0.7)
for i in range(8):  # overload chips pop (frames 46 + 4i), rising tension
    pluck(['E6', 'G6', 'A6', 'C7', 'D7', 'E7', 'G7', 'A7'][i], fr(46 + i * 4), gain=0.05, decay=0.08, pan=0.6 * (-1) ** i, bright=0.3, bus=fx)
whoosh(fr(42), 0.5, 0.08)
whoosh(fr(84), 0.5, 0.1)
# "Meet" (3.0s): everything drops out — then logo hit on beat 7 (3.5s)
whoosh(3.5, 0.5, 0.12)
impact(3.5, 0.55)
bell('C6', 3.5, 0.16, 1.4)
bell('G6', 3.62, 0.09, 1.2, 0.3)
pad(['C4', 'E4', 'G4'], 3.5, 4.5, 0.07)
for k, t in enumerate((3.5, 3.75, 4.0, 4.125, 4.25, 4.3125, 4.375, 4.4375)):  # snare build into the drop
    snare(t, 0.12 + 0.03 * k)
riser(4.5, 1.0, 0.12)

# FOLLOW-THROUGH (4.5 – 11.0s): full groove drop
crash(4.5, 0.14)
groove(4.5, 11.0)
chords_and_bass(4.5, 11.0)
hook(6.0, 11.0, gain=0.1)
for i in range(6):  # check-marks complete on the beat (frames 135 + 30 + 15i)
    bell(['E6', 'G6', 'A6', 'C7', 'D7', 'E7'][i], fr(165 + 15 * i), 0.07, 0.5, 0.4 * (-1) ** i)
whoosh(fr(135 + 94 + 16), 1.0, 0.2)  # ribbon sweep
bell('C7', fr(135 + 105), 0.08, 0.8)  # floating card
for i in range(3):
    bell(['G6', 'C7', 'E7'][i], fr(135 + 135 + 15 * i), 0.07, 0.6, -0.3 + 0.3 * i)
riser(11.0, 0.8, 0.08)

# VISIBILITY (11.0 – 17.5s): halftime breakdown under the chasing, groove back on "Clear updates"
groove(11.0, 13.0, kick_on=False, clap_on=False, hats='8')
chords_and_bass(11.0, 13.0, stabs=False, bass_on=False, pad_gain=0.08)
for i in range(4):  # chasing bubbles pop
    pluck('A5', fr(336 + i * 5), gain=0.06, decay=0.07, pan=0.5 * (-1) ** i, bus=fx)
    pluck('E5', fr(336 + i * 5) + 0.06, gain=0.05, decay=0.08, pan=0.5 * (-1) ** i, bus=fx)
whoosh(fr(364 + 6), 0.4, 0.12)  # strike-through swipe
crash(13.0, 0.09)
kick(13.0)
groove(13.0, 17.5)
chords_and_bass(13.0, 17.5)
hook(13.0, 17.0, gain=0.1)
# cursor click on beat (frame 450 = 15.0s)
click = tt(0.03)
put(fx, hp(rng.standard_normal(len(click))) * np.exp(-click / 0.004), 15.0, 0.4, 0.25)
bell('E7', 15.03, 0.08, 0.6, 0.4)
riser(17.5, 1.0, 0.13)

# OUTRO (17.5 – 22s): brand wipe hit, circle wipe, logo resolve
impact(17.5, 0.6)
crash(17.5, 0.2)
whoosh(17.55, 0.5, 0.16)
groove(17.5, 19.5)
chords_and_bass(17.5, 19.5)
hook(17.5, 19.5, gain=0.11)
whoosh(19.6, 0.7, 0.16)  # circle wipe
impact(20.0, 0.5)
kick(20.0)
pad(['C3', 'G3', 'C4', 'E4', 'G4', 'D5'], 20.0, 21.6, 0.12)
bass('C2', 20.0, length=1.4, gain=0.3)
for i, (n, dt) in enumerate((('C6', 0.0), ('G6', 0.25), ('E6', 0.5), ('C7', 0.75))):  # logo motif
    bell(n, 20.0 + dt, 0.11, 1.4, [-0.3, 0.3, -0.1, 0.1][i])

# ------------------------------------------------------------------ mix
# sidechain: duck the music bus under every kick
duck = np.ones(N)
for t in np.arange(0, DUR, B):
    i0 = int(t * SR)
    seg = np.arange(int(0.22 * SR))
    if i0 + len(seg) < N and np.abs(drums[i0 : i0 + 400, 0]).max() > 0.3:
        duck[i0 : i0 + len(seg)] = np.minimum(duck[i0 : i0 + len(seg)], 0.45 + 0.55 * (seg / len(seg)) ** 0.6)
music *= duck[:, None]


def space(x, sec=1.4, mix=0.18, seed=3):
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    ir = r.standard_normal(n) * np.exp(-np.arange(n) / SR / (sec / 5))
    ir = lp(ir, 6)
    ir /= np.sqrt((ir ** 2).sum())
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x + wet * mix


for ch in (0, 1):
    music[:, ch] = space(music[:, ch], seed=3 + ch)
    fx[:, ch] = space(fx[:, ch], 2.0, 0.3, seed=5 + ch)
    drums[:, ch] = space(drums[:, ch], 0.6, 0.06, seed=7 + ch)

mix = drums * 1.0 + music * 1.1 + fx * 1.0
mix = np.tanh(mix * 1.6) / 1.6
mix *= np.clip((DUR - np.arange(N) / SR) / 0.8, 0, 1)[:, None]  # tail fade
mix *= 10 ** (-4.0 / 20) / np.abs(mix).max()  # ≈ -14 LUFS, -4 dBFS peak

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'sancho-promo-bgm.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.abspath(out))
