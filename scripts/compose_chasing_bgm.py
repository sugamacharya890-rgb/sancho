"""
Soundtrack for SanchoChasingVideo (Script 02, 24s). Original and license-free.
120 bpm (1 beat = 15 frames); every cue below is pinned to a frame in src/chasing/.

Arc: uneasy, sparse chasing loop -> breath + warm bloom on "Meet Sancho" ->
gentle marimba groove under the clear feed -> confident lift for follow-through ->
brand hit, circle-wipe whoosh, logo motif and a sparkle on "Download Now".

    python3 scripts/compose_chasing_bgm.py   # -> public/audio/sancho-chasing-bgm.wav
"""
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sancho_audio import Mix  # noqa: E402

B = 0.5
m = Mix(24.0, seed=37)


def fr(frame):
    return frame / 30


def up(n, k=1):
    return n[:-1] + str(int(n[-1]) + k)


# D major: I – V – vi – IV
PROG = [('D2', ['D4', 'F#4', 'A4']), ('A1', ['C#4', 'E4', 'A4']), ('B1', ['D4', 'F#4', 'B4']), ('G1', ['D4', 'G4', 'B4'])]
MARIMBA = [
    ['F#5', None, None, 'A5', None, None, 'B5', None, 'A5', None, 'F#5', None, None, 'E5', None, None],
    ['E5', None, None, 'C#5', None, None, 'E5', None, 'A5', None, None, None, 'E5', None, 'C#5', None],
    ['D5', None, None, 'F#5', None, None, 'B5', None, 'A5', None, 'F#5', None, None, 'D5', None, None],
    ['B4', None, None, 'D5', None, None, 'G5', None, 'F#5', None, 'E5', None, 'D5', None, None, None],
]
LEAD = [  # brighter pluck hook for the lift (8ths)
    ['A5', None, 'D6', None, 'C#6', 'A5', None, 'F#5'],
    ['E5', None, 'F#5', 'A5', None, None, 'E5', None],
    ['F#5', None, 'B5', None, 'A5', 'F#5', None, 'D5'],
    ['G5', None, None, 'F#5', 'E5', None, 'D5', None],
]


def bar(t):
    return int(t // (4 * B) + 1e-9)


def harmony(t0, t1, piano_on=True, bass_on=True, pad_gain=0.045, pattern='push'):
    b = bar(t0 + 1e-6)
    while b * 4 * B < t1 - 1e-6:
        t = b * 4 * B
        root, ch = PROG[b % 4]
        m.pad(ch, max(t, t0), min(t + 4 * B, t1), pad_gain)
        offs = (0, 1.5, 3) if pattern == 'push' else (0,)
        for off in offs:
            tk = t + off * B
            if piano_on and t0 - 1e-6 <= tk < t1 - 1e-6:
                m.piano(ch, tk, 0.08 if off == 0 else 0.05, pan=-0.15)
        if bass_on:
            for off, ln in ((0, 1.3), (1.5, 0.4), (2.5, 0.9)):
                tk = t + off * B
                if t0 - 1e-6 <= tk < t1 - 1e-6:
                    m.sub(root, tk, ln, 0.26 if off == 0 else 0.18)
        b += 1


def marimba_hook(t0, t1, gain=0.14):
    b = bar(t0 + 1e-6)
    while b * 4 * B < t1 - 1e-6:
        t = b * 4 * B
        for k, n in enumerate(MARIMBA[b % 4]):
            tk = t + k * B / 4
            if n and t0 - 1e-6 <= tk < t1 - 1e-6:
                m.marimba(n, tk, gain, pan=0.25 * np.sin(k * 1.3))
                m.marimba(n, tk + 3 * B / 4, gain * 0.2, pan=-0.45)
        b += 1


def lead_hook(t0, t1, gain=0.09):
    b = bar(t0 + 1e-6)
    while b * 4 * B < t1 - 1e-6:
        t = b * 4 * B
        for k, n in enumerate(LEAD[b % 4]):
            tk = t + k * B / 2
            if n and t0 - 1e-6 <= tk < t1 - 1e-6:
                m.pluck(n, tk, gain, 0.22, pan=0.2 * np.sin(k), bright=0.55)
        b += 1


def groove(t0, t1, style, gain=1.0):
    t = t0
    while t < t1 - 1e-6:
        bb = int(round(t / B)) % 4
        if style == 'half':
            if bb == 0:
                m.kick(t, 0.72 * gain, punch=0.8)
            if bb == 1:
                m.kick(t + B / 2, 0.42 * gain, punch=0.8)
            if bb == 2:
                m.snap(t, 0.3 * gain)
                m.rim(t + B * 0.75, 0.09 * gain)
            for s in range(4):
                m.shaker(t + s * B / 4, accent=(s == 2), gain=0.04 * gain)
        elif style == 'drive':  # confident lift: four-on-the-floor, claps, 16th hats
            m.kick(t, 0.8 * gain)
            if bb in (1, 3):
                m.clap(t, 0.28 * gain)
            for s in range(4):
                m.hat(t + s * B / 4, open_=(s == 2), gain=(0.075 if s % 2 else 0.05) * gain, pan=0.3 if s % 2 else -0.2)
        t += B


# ------------------------------------------------------------ 1 · THE CHASING LOOP (0 – 5.5s)
# muted, slightly uneasy piano ostinato (Bm – G), a clock tick, and a lonely bass
for k in range(10):  # 8th-note ostinato for 2.5 bars, thinning out
    t = k * B / 2 * 2  # quarter notes
    if t >= 5.0:
        break
    ch = ['B3', 'D4', 'F#4'] if t < 2.5 else ['G3', 'B3', 'D4']
    m.piano([ch[k % 3], up(ch[(k + 1) % 3], 0)], t + 0.0, 0.07, 0.35, pan=0.2, muted=True)
m.pad(['B3', 'D4', 'F#4'], 0.0, 2.5, 0.04, attack=0.8)
m.pad(['G3', 'B3', 'D4', 'E4'], 2.5, 5.1, 0.05, attack=0.6, release=0.3)
m.sub('B1', 0.0, 2.4, 0.16)
m.sub('G1', 2.5, 2.4, 0.18)
for k in range(int(5.0 / B)):  # clock tick on the beat — time passing between replies
    m.tick(k * B + 0.02, 0.035 + 0.01 * (k % 2), pan=0.3 if k % 2 else -0.3)
for f_at in (14, 30, 46, 72, 92):  # each unanswered question: soft "sent" ping
    t = fr(f_at)
    m.marimba('A5', t, 0.07, 0.4)
    m.marimba('E6', t + 0.08, 0.05, 0.4)
for k in range(3):  # Mom is typing… (frames 56–70) — then nothing
    m.tick(fr(57) + k * 0.13, 0.03, pan=-0.4)
m.swell(2.5, 0.6, 0.06)  # "Chasing updates gets exhausting."
# the snap (frame 150): quick whoosh, then a breath of near-silence before Sancho
m.whoosh(fr(152), 0.35, 0.14)

# ------------------------------------------------------------ 2 · MEET SANCHO & VISIBILITY (5.5 – 12.5s)
m.swell(5.5, 0.5, 0.1)
m.shimmer(5.5, 0.06)
m.pad(['D3', 'A3', 'D4', 'F#4', 'A4'], 5.5, 8.0, 0.08, attack=0.3)
m.sub('D2', 5.5, 2.4, 0.22)
m.piano(['D4', 'F#4', 'A4', 'D5'], 5.5, 0.09, 1.6)
m.boom(6.0, 0.35)  # logo settles (frame 180)
for i, (n, dt) in enumerate((('D6', 0.0), ('A6', 0.14), ('F#6', 0.28))):
    m.bell(n, 6.0 + dt, 0.1, 1.2, [-0.3, 0.3, 0][i])
m.whoosh(fr(165 + 66 + 8), 0.5, 0.08)  # lockup docks to the header
# 8.0s: the clear feed arrives — warm half-time groove + marimba
m.shimmer(8.0, 0.05)
groove(8.0, 12.5, 'half')
harmony(8.0, 12.5)
marimba_hook(8.0, 12.5, 0.13)
for i in range(5):  # feed rows land (frames 240 + 5i)
    m.marimba(['D6', 'E6', 'F#6', 'A6', 'B6'][i], fr(240 + 5 * i), 0.04, 0.3 * (-1) ** i, bus='fx')
m.click(10.0)  # cursor click (frame 300)
m.bell('F#7', 10.03, 0.08, 0.7, 0.4)
m.bell('A6', 10.5, 0.05, 0.8)  # "Clarity without chasing."
m.riser(12.5, 1.0, 0.09)

# ------------------------------------------------------------ 3 · FOLLOW-THROUGH BEHIND THE SCENES (12.5 – 18.5s)
m.whoosh(12.75, 1.0, 0.18)  # ribbon sweep
m.crash(12.5, 0.1)
m.kick(12.5, 0.85)
groove(12.5, 18.5, 'drive')
harmony(12.5, 18.5)
lead_hook(12.5, 18.0, 0.09)
marimba_hook(14.5, 18.5, 0.08)
for i, f_at in enumerate((405, 420, 435, 450)):  # timeline stops complete on the beat
    m.bell(['A6', 'B6', 'D7', 'F#7'][i], fr(f_at), 0.06, 0.5, 0.4 * (-1) ** i)
for i, f_at in enumerate((465, 470)):  # side tags pop
    m.pluck(['D6', 'A6'][i], fr(f_at), 0.06, 0.12, pan=[-0.5, 0.5][i], bus='fx')
m.riser(18.5, 1.0, 0.12)

# ------------------------------------------------------------ 4 · DOWNLOAD NOW OUTRO (18.5 – 24s)
m.boom(18.5, 0.5)
m.crash(18.5, 0.16)
m.whoosh(18.55, 0.5, 0.16)  # teal brand wipe
m.bell('D7', fr(567), 0.07, 0.8)  # "Calm care from anywhere." pill
groove(18.5, 21.0, 'drive')
harmony(18.5, 21.0)
lead_hook(18.5, 21.0, 0.1)
m.whoosh(21.05, 0.7, 0.15)  # circle wipe (frame 630)
m.boom(21.5, 0.4)  # logo (frame 645)
m.kick(21.5, 0.6)
m.piano(['D3', 'A3', 'D4', 'F#4', 'A4', 'E5'], 21.5, 0.13, 2.2)
m.pad(['D3', 'A3', 'F#4', 'A4', 'E5'], 21.5, 23.3, 0.08)
m.sub('D2', 21.5, 1.8, 0.25)
for i, (n, dt) in enumerate((('D6', 0.0), ('A6', 0.25), ('F#6', 0.5))):  # logo motif
    m.marimba(n, 21.5 + dt, 0.11, [-0.3, 0.3, 0][i])
    m.bell(n, 21.5 + dt, 0.045, 1.4)
m.shimmer(22.0, 0.07)  # "Download Now" appears (frame 660)
m.bell('D7', 22.0, 0.09, 1.6, 0.2)
m.bell('A7', 22.12, 0.05, 1.4, -0.2)

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'sancho-chasing-bgm.wav')
m.render(out, peak_db=-2.0)
print('wrote', os.path.abspath(out))
