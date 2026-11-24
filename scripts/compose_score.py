"""
Original background score for the Sancho explainer (48s), synthesized from scratch
so it is fully license-free. Every cue is placed on the video's frame timeline (30fps).

    python3 scripts/compose_score.py   # -> public/audio/sancho-score.wav

Arc: tense ticking A-minor bed (overload) -> resolves into a steady major arpeggio
when Sancho enters (continuity) -> brief tension under the chasing thread -> bloom on
the visit summary -> warm swell and ring-out for the brand outro.
"""
import os
import wave

import numpy as np

SR = 44100
FPS = 30
DUR = 48.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)


def f(frame):  # frame -> seconds
    return frame / FPS


def hz(note):
    names = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + (o - 4) * 12) / 12)


def add(sig, t0, pan=0.0, gain=1.0):
    i0 = int(t0 * SR)
    if i0 >= N:
        return
    sig = sig[: N - i0] * gain
    lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    L[i0 : i0 + len(sig)] += sig * lg
    R[i0 : i0 + len(sig)] += sig * rg


def env_adsr(n, a, r, sustain_len):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    rel_start = a + sustain_len
    e = np.where(t > rel_start, e * np.exp(-(t - rel_start) / max(r, 1e-4) * 3), e)
    return e


def pad(notes, t0, t1, gain=0.06, attack=1.6, release=1.8, bright=0.25):
    dur = t1 - t0 + release
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for note in notes:
        fr = hz(note)
        for det in (-0.12, 0.0, 0.11):  # gentle chorus
            ph = rng.uniform(0, 2 * np.pi)
            ff = fr * 2 ** (det / 12)
            out += np.sin(2 * np.pi * ff * t + ph) + bright * np.sin(4 * np.pi * ff * t + ph) * 0.5
    out *= env_adsr(n, attack, release, t1 - t0 - attack) * (1 + 0.08 * np.sin(2 * np.pi * 0.18 * t))
    add(out / (len(notes) * 3), t0, pan=0, gain=gain)


def pluck(note, t0, gain=0.12, decay=1.2, pan=0.0, harm=0.35):
    fr = hz(note)
    n = int((decay * 3) * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for k, a in ((1, 1.0), (2, harm), (3, harm * 0.4), (4, harm * 0.15)):
        s += a * np.sin(2 * np.pi * fr * k * t) * np.exp(-t * (1.0 / decay) * (1 + (k - 1) * 1.6))
    s *= np.minimum(1, t / 0.004)
    add(s, t0, pan, gain)


def bell(note, t0, gain=0.08, decay=2.6, pan=0.0):
    fr = hz(note)
    n = int(decay * 3 * SR)
    t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * fr * t) * np.exp(-t / decay)
         + 0.35 * np.sin(2 * np.pi * fr * 2.76 * t) * np.exp(-t / (decay * 0.4))
         + 0.15 * np.sin(2 * np.pi * fr * 5.40 * t) * np.exp(-t / (decay * 0.2)))
    s *= np.minimum(1, t / 0.002)
    add(s, t0, pan, gain)


def tick(t0, gain=0.03, pan=0.0):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    s = np.diff(rng.standard_normal(n + 1)) * np.exp(-t / 0.006)
    s += 0.5 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t / 0.01)
    add(s, t0, pan, gain)


def sub(note, t0, t1, gain=0.12):
    n = int((t1 - t0 + 1.5) * SR)
    t = np.arange(n) / SR
    fr = hz(note)
    # restrained fundamental + a touch of 2nd harmonic so it translates on small speakers
    s = (np.sin(2 * np.pi * fr * t) + 0.35 * np.sin(4 * np.pi * fr * t)) * env_adsr(n, 0.8, 1.5, t1 - t0 - 0.8)
    add(s, t0, 0, gain * 0.4)


def swell(t_peak, length=2.2, gain=0.05, reverse=True):
    """Soft filtered-noise inhale that peaks exactly on a transition."""
    n = int(length * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    # smooth (lowpass) by moving average so it reads as air, not hiss
    k = 24
    noise = np.convolve(noise, np.ones(k) / k, mode='same')
    e = (t / length) ** 2.4 if reverse else np.exp(-t / (length / 4))
    s = noise * e
    s[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))
    add(s, t_peak - length if reverse else t_peak, 0, gain)


def blip(t0, up=True, gain=0.05, pan=0.0):
    a, b = ('E5', 'A5') if up else ('A5', 'E5')
    pluck(a, t0, gain=gain, decay=0.18, pan=pan, harm=0.1)
    pluck(b, t0 + 0.07, gain=gain * 0.9, decay=0.22, pan=pan, harm=0.1)


# ---------------------------------------------------------------- Scene 1 (0–12s)
pad(['A2', 'E3', 'A3', 'B3', 'C4', 'E4'], 0.0, 6.4, gain=0.07, attack=2.2)
pad(['F2', 'C3', 'E3', 'A3', 'B3'], 6.0, 11.9, gain=0.08, attack=1.4, release=0.6, bright=0.4)
sub('A1', 0.3, 6.2, 0.10)
sub('F1', 6.0, 11.8, 0.11)
beat = 60 / 100  # clock-like tick under the overload, 100 bpm
for k in range(int(11.8 / (beat / 2))):
    t = 0.6 + k * beat / 2
    if t < 11.7:
        tick(t, gain=0.022 + 0.018 * (t / 12) + (0.012 if k % 2 == 0 else 0), pan=0.3 if k % 2 else -0.3)
arrivals = [34, 54, 72, 88, 102, 114, 125, 135, 144]
arr_notes = ['E4', 'A4', 'C5', 'B4', 'E5', 'D5', 'F5', 'E5', 'G#5'.replace('#', '#')]
arr_notes[-1] = 'F5'
for i, fr in enumerate(arrivals):
    pluck(arr_notes[i], f(fr + 6), gain=0.07, decay=0.7, pan=(-0.5 if i % 2 else 0.5))
# unease builds: a dissonant shimmer (B against C) in the last stretch
pluck('B5', f(260), gain=0.035, decay=1.6, pan=0.6)
pluck('C6', f(275), gain=0.035, decay=1.6, pan=-0.6)
pluck('B5', f(300), gain=0.04, decay=1.6, pan=0.4)
swell(12.0, length=2.6, gain=0.06)

# ---------------------------------------------------------------- Scene 2 (12–26s)
bpm = 96
e8 = 60 / bpm / 2
bar = 60 / bpm * 4
s2_chords = [
    (12.0, ['F3', 'A3', 'C4', 'E4', 'G4'], 'F1'),
    (12.0 + bar, ['E3', 'G3', 'C4', 'E4', 'G4'], 'C2'),
    (12.0 + 2 * bar, ['A3', 'C4', 'E4', 'G4', 'B4'], 'A1'),
    (12.0 + 3 * bar, ['G3', 'C4', 'D4', 'E4', 'G4'], 'G1'),
    (12.0 + 4 * bar, ['F3', 'A3', 'C4', 'E4', 'G4'], 'F1'),
    (12.0 + 5 * bar, ['E3', 'G3', 'C4', 'E4', 'G4'], 'C2'),
]
bell('C6', 12.05, gain=0.06)  # Sancho arrives
bell('G5', 12.25, gain=0.045, pan=0.3)
pattern = [0, 2, 4, 3, 1, 3, 2, 4]


def arpeggiate(chords, t_end, gain=0.06, step=e8, fade_in=0.0):
    for ci, (t0, notes, bass) in enumerate(chords):
        t1 = chords[ci + 1][0] if ci + 1 < len(chords) else t_end
        pad([n for n in notes[:4]], t0, t1, gain=0.05, attack=0.9, release=1.2, bright=0.15)
        sub(bass, t0, t1 - 0.1, 0.09)
        k = 0
        t = t0
        while t < t1 - 0.02:
            ramp = min(1, (t - chords[0][0]) / fade_in) if fade_in else 1
            note = notes[pattern[k % len(pattern)] % len(notes)]
            up = note[:-1] + str(int(note[-1]) + 1)
            pluck(up, t, gain=gain * ramp * (1.0 if k % 4 == 0 else 0.75), decay=0.9, pan=0.35 * np.sin(k * 0.9))
            k += 1
            t += step


arpeggiate(s2_chords, 25.85, gain=0.055, fade_in=2.5)
# a soft chime each time an item resolves on the track (frames from Scene2 resolve logic)
for fr, note in ((465, 'E6'), (479, 'G6'), (517, 'C6'), (660, 'E6')):
    bell(note, f(fr), gain=0.035, decay=1.4, pan=0.5)

# ---------------------------------------------------------------- Scene 3 (starts frame 768)
S3F = 768
S4T = f(1188)
swell(f(S3F) + 0.2, length=1.2, gain=0.03)
pad(['D3', 'F3', 'A3', 'C4', 'E4'], f(S3F), f(S3F) + 6.0, gain=0.07, attack=1.0, release=0.8, bright=0.3)
sub('D2', f(S3F), f(S3F) + 5.8, 0.09)
for k in range(int(5.6 / (60 / 100))):
    tick(f(S3F) + 0.4 + k * 0.6, gain=0.02, pan=0.2 if k % 2 else -0.2)
bubble_at = [14, 32, 48, 66, 82, 100, 116]
for i, lf in enumerate(bubble_at):
    blip(f(S3F + lf + 4), up=(i % 2 == 0), gain=0.045, pan=0.45 if i % 2 == 0 else -0.25)
swell(f(S3F + 190), length=1.6, gain=0.06)
summary = f(S3F + 190)
bell('C6', summary, gain=0.07)
bell('E6', summary + 0.12, gain=0.05, pan=0.3)
for i in range(3):
    bell(['G5', 'A5', 'C6'][i], f(S3F + 190 + 16 + i * 6 + 8), gain=0.03, decay=1.2, pan=-0.3 + 0.3 * i)
s3_chords = [
    (summary, ['C3', 'E3', 'G3', 'D4', 'E4'], 'C2'),
    (summary + bar, ['F3', 'A3', 'C4', 'E4', 'G4'], 'F1'),
    (summary + 2 * bar, ['G3', 'B3', 'D4', 'E4', 'G4'], 'G1'),
]
arpeggiate(s3_chords, S4T - 0.1, gain=0.05, fade_in=1.5)

# ---------------------------------------------------------------- Scene 4 (40–48s)
swell(S4T, length=2.4, gain=0.06)
pad(['F2', 'C3', 'A3', 'E4', 'G4'], S4T, S4T + 2.2, gain=0.09, attack=0.5, release=1.6, bright=0.2)
pad(['C3', 'G3', 'B3', 'D4', 'E4', 'G4'], S4T + 2.0, 47.0, gain=0.1, attack=1.0, release=1.4, bright=0.2)
sub('F1', S4T, S4T + 2.0, 0.11)
sub('C2', S4T + 2.0, 46.8, 0.12)
for i, (note, dt) in enumerate((('C5', 0.25), ('G5', 0.6), ('E5', 0.95), ('C6', 1.5))):  # logo motif
    bell(note, S4T + dt, gain=0.06, decay=2.8, pan=[-0.3, 0.3, -0.1, 0.1][i])
q = 60 / bpm
k = 0
t = S4T + 2.0
for note in ['E5', 'G5', 'B5', 'D6', 'E6', 'D6', 'B5', 'G5', 'E5', 'D5']:
    pluck(note, t, gain=0.05 * (1 - k / 12), decay=1.3, pan=0.3 * np.sin(k))
    k += 1
    t += q
bell('G6', f(1188 + 152), gain=0.04, decay=2.0, pan=0.4)  # CTA arrives

# ---------------------------------------------------------------- reverb + master
def reverb(x, seconds=2.6, mix=0.28, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t / (seconds / 5.5))
    ir = np.convolve(ir, np.ones(8) / 8, mode='same')  # darken tail
    ir[: int(0.012 * SR)] = 0  # pre-delay
    ir /= np.sqrt(np.sum(ir ** 2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - mix) + wet * mix * 1.4


L = reverb(L, seed=1)
R = reverb(R, seed=2)
mix = np.stack([L, R], axis=1)
fade_in = np.minimum(1, np.arange(N) / (0.25 * SR))
fade_out = np.clip((DUR - np.arange(N) / SR) / 1.6, 0, 1)
mix *= (fade_in * fade_out)[:, None]
mix = np.tanh(mix * 2.0) / 2.0  # gentle glue
mix *= 10 ** (-3 / 20) / np.max(np.abs(mix))  # -3 dBFS peak: a bed that sits under VO

out = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio', 'sancho-score.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.abspath(out))
