"""
Alternative background track (B) for the 22s Sancho promo: warm, uplifting
marimba + piano with a half-time groove. Original and license-free, synthesized
from scratch. Same 120 bpm grid as the visuals (1 beat = 15 frames), same hit points.

    python3 scripts/compose_promo_bgm_b.py   # -> public/audio/sancho-promo-bgm-b.wav
"""
import os
import wave

import numpy as np

SR = 44100
DUR = 22.0
N = int(SR * DUR)
B = 0.5  # 120 bpm
rng = np.random.default_rng(23)
drums = np.zeros((N, 2))
music = np.zeros((N, 2))
fx = np.zeros((N, 2))


def fr(frame):
    return frame / 30


def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}
    return 440.0 * 2 ** ((names[note[:-1]] + (int(note[-1]) - 4) * 12) / 12)


def up(note, k=1):
    return note[:-1] + str(int(note[-1]) + k)


def put(bus, sig, t0, pan=0.0, gain=1.0):
    i0 = int(round(t0 * SR))
    if i0 < 0:
        sig, i0 = sig[-i0:], 0
    if i0 >= N:
        return
    sig = sig[: N - i0] * gain
    bus[i0 : i0 + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4)
    bus[i0 : i0 + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4)


def tt(sec):
    return np.arange(int(sec * SR)) / SR


def hp(x):
    return np.diff(x, prepend=0)


def lp(x, k):
    return np.convolve(x, np.ones(k) / k, mode='same')


# ------------------------------------------------------------------ instruments
def kick(t0, gain=0.75):  # rounder, softer kick
    t = tt(0.5)
    f = 45 + 80 * np.exp(-t / 0.045)
    put(drums, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2), t0, 0, gain)


def snap(t0, gain=0.3, pan=0.15):  # finger snap
    t = tt(0.12)
    s = hp(hp(rng.standard_normal(len(t)))) * np.exp(-t / 0.018) + 0.3 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.01)
    put(drums, s, t0, pan, gain)


def rim(t0, gain=0.18):
    t = tt(0.08)
    put(drums, (np.sin(2 * np.pi * 820 * t) + 0.5 * np.sin(2 * np.pi * 1640 * t)) * np.exp(-t / 0.015), t0, -0.2, gain)


def shaker(t0, accent=False, gain=0.05):
    t = tt(0.09)
    e = np.minimum(1, t / 0.015) * np.exp(-t / 0.03)
    put(drums, hp(hp(rng.standard_normal(len(t)))) * e, t0, 0.45, gain * (1.6 if accent else 1))


def marimba(note, t0, gain=0.16, pan=0.0):
    f = hz(note)
    t = tt(0.9)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.28) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.05)
    s += 0.12 * np.sin(2 * np.pi * f * 9.9 * t) * np.exp(-t / 0.012)  # mallet tick
    put(music, s * np.minimum(1, t / 0.002), t0, pan, gain)


def piano(notes, t0, gain=0.07, decay=1.1, pan=0.0):
    t = tt(decay * 3.5)
    s = np.zeros(len(t))
    for n in notes:
        f = hz(n)
        for k, a in ((1, 1.0), (2, 0.45), (3, 0.22), (4, 0.1), (5, 0.05)):
            s += a * np.sin(2 * np.pi * f * k * 1.0007 ** k * t) * np.exp(-t / decay * (1 + 0.35 * (k - 1)))
    s *= np.minimum(1, t / 0.004)
    put(music, s / len(notes), t0, pan, gain)


def pad(notes, t0, t1, gain=0.045):
    t = tt(t1 - t0 + 0.8)
    s = np.zeros(len(t))
    for n in notes:
        for det in (-0.1, 0.1):
            s += np.sin(2 * np.pi * hz(n) * 2 ** (det / 12) * t + rng.uniform(0, 6))
    s *= np.minimum(1, t / 0.4) * np.clip((t1 - t0 + 0.8 - t) / 0.8, 0, 1) * (1 + 0.1 * np.sin(2 * np.pi * 0.25 * t))
    put(music, s / (2 * len(notes)), t0, 0, gain)


def sub(note, t0, length, gain=0.26):
    t = tt(length + 0.1)
    f = hz(note)
    s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / 0.01) * np.exp(-t / (length * 1.2))
    s *= np.clip((length + 0.1 - t) / 0.05, 0, 1)
    put(music, s, t0, 0, gain)


def bell(note, t0, gain=0.1, decay=1.0, pan=0.0):
    f = hz(note)
    t = tt(decay * 4)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / decay) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / (decay * 0.3))
    put(fx, s * np.minimum(1, t / 0.002), t0, pan, gain)


def swell(t_peak, length=1.0, gain=0.12):  # reversed airy swell into a hit
    t = tt(length)
    n = lp(rng.standard_normal(len(t)), 10)
    put(fx, n * (t / length) ** 3, t_peak - length, 0, gain)


def whoosh(t_peak, length=0.6, gain=0.14):
    t = tt(length)
    n = hp(lp(rng.standard_normal(len(t)), 5))
    put(fx, n * np.sin(np.pi * t / length) ** 2, t_peak - length * 0.55, 0, gain)


def boom(t0, gain=0.45):
    t = tt(1.4)
    f = 36 + 50 * np.exp(-t / 0.06)
    put(fx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45), t0, 0, gain)


def shimmer(t0, gain=0.08):
    t = tt(2.0)
    put(fx, hp(hp(rng.standard_normal(len(t)))) * np.exp(-t / 0.6) * np.minimum(1, t / 0.05), t0, 0, gain)


# ------------------------------------------------------------------ harmony (D major: I – V – vi – IV)
PROG = [
    ('D2', ['D4', 'F#4', 'A4']),
    ('A1', ['C#4', 'E4', 'A4']),
    ('B1', ['D4', 'F#4', 'B4']),
    ('G1', ['D4', 'G4', 'B4']),
]
# marimba hook: 16th-note grid (16 steps per bar), None = rest
HOOK = [
    ['F#5', None, None, 'A5', None, None, 'B5', None, 'A5', None, 'F#5', None, None, 'E5', None, None],
    ['E5', None, None, 'C#5', None, None, 'E5', None, 'A5', None, None, None, 'E5', None, 'C#5', None],
    ['D5', None, None, 'F#5', None, None, 'B5', None, 'A5', None, 'F#5', None, None, 'D5', None, None],
    ['B4', None, None, 'D5', None, None, 'G5', None, 'F#5', None, 'E5', None, 'D5', None, None, None],
]


def bar(t):
    return int(t // (4 * B) + 1e-9)


def harmony(t0, t1, piano_on=True, bass_on=True, pad_gain=0.045, pattern='push'):
    b = bar(t0 + 1e-6)
    while b * 4 * B < t1 - 1e-6:
        t = b * 4 * B
        root, ch = PROG[b % 4]
        s, e = max(t, t0), min(t + 4 * B, t1)
        pad(ch, s, e, pad_gain)
        # piano: on 1, pushed "and" of 2, and 4 — gentle syncopation
        for off in ((0, 1.5, 3) if pattern == 'push' else (0,)):
            tk = t + off * B
            if t0 - 1e-6 <= tk < t1 - 1e-6 and piano_on:
                piano(ch, tk, 0.08 if off == 0 else 0.05, pan=-0.15)
        if bass_on:
            for off, ln in ((0, 1.3), (1.5, 0.4), (2.5, 0.9)):
                tk = t + off * B
                if t0 - 1e-6 <= tk < t1 - 1e-6:
                    sub(root, tk, ln, 0.26 if off == 0 else 0.18)
        b += 1


def hook(t0, t1, gain=0.15):
    b = bar(t0 + 1e-6)
    while b * 4 * B < t1 - 1e-6:
        t = b * 4 * B
        for k, n in enumerate(HOOK[b % 4]):
            tk = t + k * B / 4
            if n and t0 - 1e-6 <= tk < t1 - 1e-6:
                marimba(n, tk, gain, pan=0.25 * np.sin(k * 1.3))
                marimba(n, tk + 3 * B / 4, gain * 0.22, pan=-0.45)  # dotted-8th echo
        b += 1


def groove(t0, t1, style='half', gain=1.0):
    t = t0
    while t < t1 - 1e-6:
        bb = int(round(t / B)) % 4
        if style == 'half':  # half-time: kick 1 (+ pickup), snap on 3
            if bb == 0:
                kick(t, 0.75 * gain)
            if bb == 1:
                kick(t + B / 2, 0.45 * gain)
            if bb == 2:
                snap(t, 0.32 * gain)
                rim(t + B * 0.75, 0.1 * gain)
        elif style == 'four':  # lift: four-on-the-floor + snaps on 2 & 4
            kick(t, 0.7 * gain)
            if bb in (1, 3):
                snap(t, 0.3 * gain)
        elif style == 'light':
            if bb in (1, 3):
                snap(t, 0.22 * gain)
        for s in range(4):
            shaker(t + s * B / 4, accent=(s == 2), gain=0.045 * gain)
        t += B


# ------------------------------------------------------------------ arrangement
# HOOK 0–3.0: marimba hook straight away over piano, light snaps
hook(0.0, 3.0, 0.15)
harmony(0.0, 3.0, bass_on=False, pad_gain=0.05)
groove(0.0, 3.0, 'light', 0.8)
for i in range(8):  # overload chips (frames 46 + 4i): bright marimba sparkles, climbing
    marimba(['A5', 'B5', 'D6', 'E6', 'F#6', 'A6', 'B6', 'D7'][i], fr(46 + i * 4), 0.07, 0.6 * (-1) ** i)
whoosh(fr(84), 0.5, 0.1)
# "Meet" (3.0): breath — then the logo lands on 3.5
swell(3.5, 0.5, 0.12)
boom(3.5, 0.4)
bell('D6', 3.5, 0.14, 1.3)
bell('A6', 3.62, 0.08, 1.1, 0.3)
piano(['D4', 'F#4', 'A4', 'D5'], 3.5, 0.1, 1.6)
for k, t in enumerate((4.0, 4.25, 4.375)):  # little rim pickup into the groove
    rim(t, 0.12 + 0.04 * k)
swell(4.5, 1.0, 0.1)

# FOLLOW-THROUGH 4.5–11: half-time groove, full harmony, hook returns at 6.0
shimmer(4.5, 0.07)
groove(4.5, 11.0, 'half')
harmony(4.5, 11.0)
hook(6.0, 11.0, 0.14)
for i in range(6):  # check-marks complete on the beat (frames 165 + 15i)
    bell(['A6', 'B6', 'D7', 'E7', 'F#7', 'A7'][i], fr(165 + 15 * i), 0.055, 0.45, 0.4 * (-1) ** i)
whoosh(fr(245), 1.0, 0.16)  # ribbon sweep
bell('D7', fr(240), 0.07, 0.8)  # floating card
for i in range(3):
    bell(['A6', 'D7', 'F#7'][i], fr(270 + 15 * i), 0.06, 0.6, -0.3 + 0.3 * i)
swell(11.0, 0.8, 0.07)

# VISIBILITY 11–17.5: stripped back (piano + shaker) under the chasing, groove back on "Clear updates"
groove(11.0, 13.0, 'light', 0.7)
harmony(11.0, 13.0, bass_on=False, pad_gain=0.06, pattern='hold')
for i in range(4):  # chasing bubbles: two-note marimba "pings"
    marimba('E6', fr(336 + i * 5), 0.06, 0.5 * (-1) ** i)
    marimba('B5', fr(336 + i * 5) + 0.07, 0.05, 0.5 * (-1) ** i)
whoosh(fr(370), 0.4, 0.1)  # strike-through
shimmer(13.0, 0.05)
kick(13.0)
groove(13.0, 17.5, 'half')
harmony(13.0, 17.5)
hook(13.0, 17.0, 0.14)
click = tt(0.03)
put(fx, hp(rng.standard_normal(len(click))) * np.exp(-click / 0.004), 15.0, 0.4, 0.22)  # cursor tap
bell('F#7', 15.03, 0.07, 0.6, 0.4)
swell(17.5, 1.0, 0.12)

# OUTRO 17.5–22: lift to four-on-the-floor for the brand wipe, resolve on the logo
boom(17.5, 0.5)
shimmer(17.5, 0.1)
groove(17.5, 19.5, 'four')
harmony(17.5, 19.5)
hook(17.5, 19.5, 0.15)
whoosh(19.6, 0.7, 0.14)  # circle wipe
boom(20.0, 0.4)
kick(20.0, 0.6)
piano(['D3', 'A3', 'D4', 'F#4', 'A4', 'E5'], 20.0, 0.14, 2.2)
pad(['D3', 'A3', 'F#4', 'A4', 'E5'], 20.0, 21.6, 0.08)
sub('D2', 20.0, 1.6, 0.26)
for i, (n, dt) in enumerate((('D6', 0.0), ('A6', 0.25), ('F#6', 0.5), ('D7', 0.75))):  # logo motif
    marimba(n, 20.0 + dt, 0.12, [-0.3, 0.3, -0.1, 0.1][i])
    bell(n, 20.0 + dt, 0.05, 1.4)

# ------------------------------------------------------------------ mix
duck = np.ones(N)  # gentle sidechain under kicks
env = np.abs(drums[:, 0])
for t in np.arange(0, DUR, B / 2):
    i0 = int(t * SR)
    if i0 + 400 < N and env[i0 : i0 + 400].max() > 0.3:
        seg = np.arange(int(0.2 * SR))
        if i0 + len(seg) < N:
            duck[i0 : i0 + len(seg)] = np.minimum(duck[i0 : i0 + len(seg)], 0.6 + 0.4 * (seg / len(seg)) ** 0.6)
music *= duck[:, None]


def space(x, sec=1.8, mix=0.22, seed=3):
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    ir = lp(r.standard_normal(n) * np.exp(-np.arange(n) / SR / (sec / 5)), 8)
    ir /= np.sqrt((ir ** 2).sum())
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    return x + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)] * mix


for ch in (0, 1):
    music[:, ch] = space(music[:, ch], seed=31 + ch)
    fx[:, ch] = space(fx[:, ch], 2.4, 0.32, seed=41 + ch)
    drums[:, ch] = space(drums[:, ch], 0.7, 0.08, seed=51 + ch)

mix = drums + music * 1.15 + fx
mix = np.tanh(mix * 1.5) / 1.5
mix *= np.clip((DUR - np.arange(N) / SR) / 0.8, 0, 1)[:, None]
mix *= 10 ** (-2.0 / 20) / np.abs(mix).max()  # matched to track A (about -14 LUFS)

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'sancho-promo-bgm-b.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.abspath(out))
