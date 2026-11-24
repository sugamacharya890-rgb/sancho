"""Small synthesis toolkit shared by Sancho soundtrack scripts (numpy only)."""
import wave

import numpy as np

SR = 44100


class Mix:
    def __init__(self, dur, seed=1):
        self.dur = dur
        self.n = int(SR * dur)
        self.rng = np.random.default_rng(seed)
        self.bus = {k: np.zeros((self.n, 2)) for k in ('drums', 'music', 'fx')}

    # -------------------------------------------------------------- utilities
    @staticmethod
    def hz(note):
        names = {'C': -9, 'C#': -8, 'D': -7, 'Eb': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'Ab': -1, 'A': 0, 'Bb': 1, 'B': 2}
        return 440.0 * 2 ** ((names[note[:-1]] + (int(note[-1]) - 4) * 12) / 12)

    @staticmethod
    def tt(sec):
        return np.arange(int(sec * SR)) / SR

    @staticmethod
    def hp(x):
        return np.diff(x, prepend=0)

    @staticmethod
    def lp(x, k):
        return np.convolve(x, np.ones(k) / k, mode='same')

    def noise(self, n):
        return self.rng.standard_normal(n)

    def put(self, bus, sig, t0, pan=0.0, gain=1.0):
        b = self.bus[bus]
        i0 = int(round(t0 * SR))
        if i0 < 0:
            sig, i0 = sig[-i0:], 0
        if i0 >= self.n:
            return
        sig = sig[: self.n - i0] * gain
        b[i0 : i0 + len(sig), 0] += sig * np.cos((pan + 1) * np.pi / 4)
        b[i0 : i0 + len(sig), 1] += sig * np.sin((pan + 1) * np.pi / 4)

    # -------------------------------------------------------------- drums
    def kick(self, t0, gain=0.8, punch=1.0):
        t = self.tt(0.5)
        f = 46 + 100 * punch * np.exp(-t / 0.04)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
        s[:180] += self.noise(180) * np.linspace(0.35 * punch, 0, 180)
        self.put('drums', s, t0, 0, gain)

    def clap(self, t0, gain=0.3):
        t = self.tt(0.3)
        n = self.hp(self.lp(self.noise(len(t)), 3))
        e = sum(np.where(t >= d, np.exp(-(t - d) / 0.008), 0) for d in (0, 0.011, 0.022))
        e = e + np.where(t >= 0.03, np.exp(-(t - 0.03) / 0.07) * 0.6, 0)
        self.put('drums', n * e, t0, 0.1, gain)

    def snap(self, t0, gain=0.28, pan=0.15):
        t = self.tt(0.12)
        s = self.hp(self.hp(self.noise(len(t)))) * np.exp(-t / 0.018) + 0.3 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.01)
        self.put('drums', s, t0, pan, gain)

    def hat(self, t0, open_=False, gain=0.08, pan=0.25):
        t = self.tt(0.25 if open_ else 0.06)
        s = self.hp(self.hp(self.noise(len(t)))) * np.exp(-t / (0.06 if open_ else 0.012))
        self.put('drums', s, t0, pan, gain)

    def shaker(self, t0, accent=False, gain=0.045):
        t = self.tt(0.09)
        e = np.minimum(1, t / 0.015) * np.exp(-t / 0.03)
        self.put('drums', self.hp(self.hp(self.noise(len(t)))) * e, t0, 0.45, gain * (1.6 if accent else 1))

    def rim(self, t0, gain=0.15):
        t = self.tt(0.08)
        self.put('drums', (np.sin(2 * np.pi * 820 * t) + 0.5 * np.sin(2 * np.pi * 1640 * t)) * np.exp(-t / 0.015), t0, -0.2, gain)

    def tick(self, t0, gain=0.05, pan=0.0):
        t = self.tt(0.04)
        s = self.hp(self.noise(len(t))) * np.exp(-t / 0.004) + 0.4 * np.sin(2 * np.pi * 3100 * t) * np.exp(-t / 0.006)
        self.put('drums', s, t0, pan, gain)

    # -------------------------------------------------------------- tonal
    def marimba(self, note, t0, gain=0.15, pan=0.0, bus='music'):
        f = self.hz(note)
        t = self.tt(0.9)
        s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.28) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.05)
        s += 0.12 * np.sin(2 * np.pi * f * 9.9 * t) * np.exp(-t / 0.012)
        self.put(bus, s * np.minimum(1, t / 0.002), t0, pan, gain)

    def pluck(self, note, t0, gain=0.12, decay=0.25, pan=0.0, bright=0.5, bus='music'):
        f = self.hz(note)
        t = self.tt(decay * 4)
        s = sum((bright ** (k - 1)) / k * np.sin(2 * np.pi * f * k * t + k) * np.exp(-t / decay * (1 + 0.5 * (k - 1))) for k in range(1, 7))
        self.put(bus, s * np.minimum(1, t / 0.003), t0, pan, gain)

    def piano(self, notes, t0, gain=0.07, decay=1.1, pan=0.0, muted=False):
        t = self.tt(decay * 3.5)
        s = np.zeros(len(t))
        for n in notes:
            f = self.hz(n)
            for k, a in ((1, 1.0), (2, 0.45), (3, 0.22), (4, 0.1), (5, 0.05)):
                if muted and k > 2:
                    continue
                s += a * np.sin(2 * np.pi * f * k * 1.0007 ** k * t) * np.exp(-t / decay * (1 + 0.35 * (k - 1)))
        self.put('music', s * np.minimum(1, t / 0.004) / len(notes), t0, pan, gain)

    def pad(self, notes, t0, t1, gain=0.045, attack=0.4, release=0.8):
        t = self.tt(t1 - t0 + release)
        s = np.zeros(len(t))
        for n in notes:
            for det in (-0.1, 0.1):
                s += np.sin(2 * np.pi * self.hz(n) * 2 ** (det / 12) * t + self.rng.uniform(0, 6))
        s *= np.minimum(1, t / attack) * np.clip((t1 - t0 + release - t) / release, 0, 1) * (1 + 0.1 * np.sin(2 * np.pi * 0.25 * t))
        self.put('music', s / (2 * len(notes)), t0, 0, gain)

    def sub(self, note, t0, length, gain=0.26):
        t = self.tt(length + 0.1)
        f = self.hz(note)
        s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / 0.01) * np.exp(-t / (length * 1.2))
        self.put('music', s * np.clip((length + 0.1 - t) / 0.05, 0, 1), t0, 0, gain)

    def bell(self, note, t0, gain=0.1, decay=1.0, pan=0.0):
        f = self.hz(note)
        t = self.tt(decay * 4)
        s = np.sin(2 * np.pi * f * t) * np.exp(-t / decay) + 0.3 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t / (decay * 0.3))
        self.put('fx', s * np.minimum(1, t / 0.002), t0, pan, gain)

    # -------------------------------------------------------------- fx
    def swell(self, t_peak, length=1.0, gain=0.12):
        t = self.tt(length)
        self.put('fx', self.lp(self.noise(len(t)), 10) * (t / length) ** 3, t_peak - length, 0, gain)

    def whoosh(self, t_peak, length=0.6, gain=0.14):
        t = self.tt(length)
        n = self.hp(self.lp(self.noise(len(t)), 5))
        self.put('fx', n * np.sin(np.pi * t / length) ** 2, t_peak - length * 0.55, 0, gain)

    def riser(self, t_end, length=1.0, gain=0.12):
        t = self.tt(length)
        f = 220 * 2 ** (3 * t / length)
        s = 0.4 * np.sin(2 * np.pi * np.cumsum(f) / SR) + self.hp(self.noise(len(t))) * 0.7
        self.put('fx', s * (t / length) ** 2, t_end - length, 0, gain)

    def boom(self, t0, gain=0.45):
        t = self.tt(1.4)
        f = 36 + 50 * np.exp(-t / 0.06)
        self.put('fx', np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45), t0, 0, gain)

    def crash(self, t0, gain=0.15):
        t = self.tt(1.8)
        self.put('fx', self.hp(self.hp(self.noise(len(t)))) * np.exp(-t / 0.5), t0, 0, gain)

    def shimmer(self, t0, gain=0.08):
        t = self.tt(2.0)
        self.put('fx', self.hp(self.hp(self.noise(len(t)))) * np.exp(-t / 0.6) * np.minimum(1, t / 0.05), t0, 0, gain)

    def click(self, t0, gain=0.22, pan=0.4):
        t = self.tt(0.03)
        self.put('fx', self.hp(self.noise(len(t))) * np.exp(-t / 0.004), t0, pan, gain)

    # -------------------------------------------------------------- master
    def _space(self, x, sec, mix, seed):
        r = np.random.default_rng(seed)
        n = int(sec * SR)
        ir = self.lp(r.standard_normal(n) * np.exp(-np.arange(n) / SR / (sec / 5)), 8)
        ir /= np.sqrt((ir ** 2).sum())
        size = 1 << int(np.ceil(np.log2(len(x) + n)))
        return x + np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)] * mix

    def render(self, path, beat=0.5, duck_depth=0.4, peak_db=-2.0, tail_fade=0.9):
        d, m, fx = self.bus['drums'], self.bus['music'], self.bus['fx']
        duck = np.ones(self.n)
        env = np.abs(d[:, 0])
        for t in np.arange(0, self.dur, beat / 2):
            i0 = int(t * SR)
            seg = np.arange(int(0.2 * SR))
            if i0 + len(seg) < self.n and env[i0 : i0 + 400].max() > 0.3:
                duck[i0 : i0 + len(seg)] = np.minimum(duck[i0 : i0 + len(seg)], 1 - duck_depth + duck_depth * (seg / len(seg)) ** 0.6)
        m *= duck[:, None]
        for ch in (0, 1):
            m[:, ch] = self._space(m[:, ch], 1.8, 0.22, 31 + ch)
            fx[:, ch] = self._space(fx[:, ch], 2.4, 0.32, 41 + ch)
            d[:, ch] = self._space(d[:, ch], 0.7, 0.08, 51 + ch)
        mix = d + m * 1.15 + fx
        mix = np.tanh(mix * 1.5) / 1.5
        mix *= np.clip((self.dur - np.arange(self.n) / SR) / tail_fade, 0, 1)[:, None]
        mix *= 10 ** (peak_db / 20) / np.abs(mix).max()
        with wave.open(path, 'wb') as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix * 32767).astype('<i2').tobytes())
