"""
Original score for the Nexa showreel, synthesised from scratch so every hit sits
exactly on the edit's grid: 120 BPM, a beat every 0.5s, a bar every 2s.

No samples, no numpy: plain Python into float arrays, then a 16-bit WAV.

Sections (seconds) mirror the edit in index.html:
  0-2    intro: pad swell, sub hit as the mark lands, riser into the words
  2-4    "Brand." "Digital." "Motion." on beats, bigger hit on the red card
  4-36   four projects, 4 bars each: groove, riser + drop-out into each change,
         crash on every section downbeat; energy builds section by section
  36-38  outro grid, filter closing
  38-42  final hit on the end card, tail rings out
"""
import math, random, wave, array, sys

SR = 44100
BPM = 120.0
B = 60.0 / BPM            # 0.5s beat
BAR = 4 * B               # 2s bar
LENGTH = 42.0
N = int(LENGTH * SR)
random.seed(7)

L = array.array("f", [0.0]) * N
R = array.array("f", [0.0]) * N
VERB = array.array("f", [0.0]) * N   # mono send into the reverb

def add(buf, start_s, samples, gain=1.0):
    i0 = int(round(start_s * SR))
    for k, v in enumerate(samples):
        i = i0 + k
        if 0 <= i < N:
            buf[i] += v * gain

def add_st(start_s, samples, gain=1.0, pan=0.0, send=0.0):
    gl = gain * math.cos((pan + 1) * math.pi / 4) * math.sqrt(2)
    gr = gain * math.sin((pan + 1) * math.pi / 4) * math.sqrt(2)
    add(L, start_s, samples, gl)
    add(R, start_s, samples, gr)
    if send:
        add(VERB, start_s, samples, gain * send)

def note(name):
    names = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3,
             "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[pitch] + 12 * (octave - 4)) / 12)

# ── instruments ─────────────────────────────────────────────────────────

def kick(length=0.42, punch=1.0):
    out, ph = [], 0.0
    for k in range(int(length * SR)):
        t = k / SR
        f = 46 + 130 * math.exp(-t * 32) * punch
        ph += 2 * math.pi * f / SR
        env = math.exp(-t * 7.5)
        click = (random.uniform(-1, 1) * math.exp(-t * 900)) * 0.35
        out.append(math.sin(ph) * env + click)
    return out

def noise_hp(length, decay, hp=0.85):
    """White noise, crudely high-passed (one-pole difference), exp decay."""
    out, prev_in, prev_out = [], 0.0, 0.0
    for k in range(int(length * SR)):
        t = k / SR
        x = random.uniform(-1, 1)
        y = hp * (prev_out + x - prev_in)
        prev_in, prev_out = x, y
        out.append(y * math.exp(-t * decay))
    return out

def clap(length=0.32):
    out = [0.0] * int(length * SR)
    for off in (0.0, 0.011, 0.022):     # three quick slaps
        burst = noise_hp(length - off, 22, 0.7)
        o = int(off * SR)
        for k, v in enumerate(burst):
            if o + k < len(out):
                out[o + k] += v * 0.6
    tail = noise_hp(length, 9, 0.6)
    return [a + b * 0.5 for a, b in zip(out, tail)]

def hat(open_=False):
    return noise_hp(0.22 if open_ else 0.05, 13 if open_ else 70, 0.95)

def tick():
    return noise_hp(0.03, 140, 0.97)

def saw_pluck(freq, length, decay=6.0, cutoff=900.0, attack=0.003):
    out, ph, lp = [], 0.0, 0.0
    a = 1 - math.exp(-2 * math.pi * cutoff / SR)
    for k in range(int(length * SR)):
        t = k / SR
        ph = (ph + freq / SR) % 1.0
        x = 2 * ph - 1
        lp += a * (x - lp)
        env = min(1.0, t / attack) * math.exp(-t * decay)
        out.append(lp * env)
    return out

def sub_hit(length=1.6, f0=62, f1=30):
    out, ph = [], 0.0
    for k in range(int(length * SR)):
        t = k / SR
        f = f1 + (f0 - f1) * math.exp(-t * 3)
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph) * math.exp(-t * 2.2))
    return out

def crash(length=2.2):
    return noise_hp(length, 2.4, 0.9)

def riser(length, f_from=300.0, f_to=9000.0):
    """Noise through a sweeping low-pass, rising in level: the classic build."""
    out, lp = [], 0.0
    n = int(length * SR)
    for k in range(n):
        p = k / n
        cutoff = f_from * (f_to / f_from) ** p
        a = 1 - math.exp(-2 * math.pi * cutoff / SR)
        lp += a * (random.uniform(-1, 1) - lp)
        out.append(lp * (p ** 2.2))
    return out

# ── the score ───────────────────────────────────────────────────────────

CHORDS = [["A3", "C4", "E4"], ["F3", "A3", "C4"], ["C4", "E4", "G4"], ["G3", "B3", "D4"]]
ROOTS = ["A2", "F2", "C3", "G2"]
SECTIONS = [4.0, 12.0, 20.0, 28.0]   # each 4 bars

kick_times = []

# Intro: logo pop on beat 1, letters on beat 2, riser into the words
add_st(0.5, sub_hit(1.4, 70, 34), 0.55, send=0.2)
add_st(0.5, tick(), 0.25, 0.3, send=0.4)
add_st(1.0, tick(), 0.2, -0.3, send=0.4)
add_st(0.5, riser(1.5, 250, 7000), 0.22, send=0.15)

# The words: a hit on each, a bigger one on the red card
for t, big in ((2.0, False), (2.5, False), (3.0, False), (3.5, True)):
    add_st(t, kick(0.42, 1.2 if big else 1.0), 0.95); kick_times.append(t)
    add_st(t, clap(), 0.38 if big else 0.3, send=0.35)
    add_st(t, saw_pluck(note("A1") * 2, 0.45, 5, 700), 0.32)
    if big:
        add_st(t, crash(1.4), 0.12, send=0.3)
add_st(3.5, riser(0.5, 800, 9000), 0.18)

# Groove, 4-36
for si, s0 in enumerate(SECTIONS):
    for bar in range(4):
        b0 = s0 + bar * BAR
        last_bar = bar == 3
        for beat in range(4):
            t = b0 + beat * B
            drop = last_bar and beat == 3          # the held breath before the change
            if not drop:
                add_st(t, kick(), 0.9); kick_times.append(t)
            if beat in (1, 3) and not drop:
                add_st(t, clap(), 0.3, 0.05, send=0.3)
            # offbeat open hat
            if not drop:
                add_st(t + B / 2, hat(True), 0.13, 0.25)
            # 16th closed hats from the second section on
            if si >= 1 and not drop:
                for q in range(4):
                    if q != 2:
                        add_st(t + q * B / 4, hat(False), 0.07 + 0.02 * (q == 0), -0.3)
        # clap roll into the change: 16ths across the last beat, rising
        if last_bar:
            for q in range(4):
                add_st(b0 + 3 * B + q * B / 4, clap(0.12), 0.08 + 0.06 * q, send=0.4)
        # bass: 8ths on the bar's root, octave on the offbeats (it pumps
        # because each note restarts just after a kick)
        root = note(ROOTS[bar])
        for e in range(8):
            if last_bar and e >= 6:
                continue
            f = root * (2 if e % 2 else 1)
            add_st(b0 + e * B / 2, saw_pluck(f, 0.24, 7, 650 if e % 2 else 480), 0.34)
        # arpeggio over the last project, the climax
        if si == 3:
            tones = [note(n) * 2 for n in CHORDS[bar]]
            for q in range(16):
                f = tones[q % 3] * (2 if q % 6 >= 3 else 1)
                add_st(b0 + q * B / 4, saw_pluck(f, 0.12, 14, 2600), 0.07, (q % 2) * 0.6 - 0.3, send=0.35)
    # riser into the next section, crash on its downbeat
    s_end = s0 + 4 * BAR
    add_st(s_end - BAR, riser(BAR, 300, 9500), 0.26, send=0.2)
    add_st(s_end, crash(), 0.22, send=0.35)
    add_st(s_end, sub_hit(1.0, 58, 32), 0.32)

# Accents on the 8th-note picture flashes (Quinn IT and Collar & Cuff)
for t in [17.0 + k * 0.25 for k in range(4)] + [33.0 + k * 0.25 for k in range(6)]:
    add_st(t, tick(), 0.22, random.uniform(-0.5, 0.5), send=0.3)

# Outro grid 36-38: kick on, cards land on 8ths, filter closing (handled below)
for beat in range(4):
    t = 36.0 + beat * B
    add_st(t, kick(), 0.8 - 0.1 * beat); kick_times.append(t)
for k in range(4):
    add_st(36.0 + k * 0.25, tick(), 0.18, (k % 2) - 0.5, send=0.4)
add_st(37.0, riser(1.0, 400, 8000), 0.2)

# Final hit on the end card
add_st(38.0, kick(0.6, 1.3), 1.0); kick_times.append(38.0)
add_st(38.0, sub_hit(3.6, 66, 28), 0.6)
add_st(38.0, crash(3.5), 0.26, send=0.5)
for n in ["A2", "E3", "A3", "C4", "E4", "B4"]:            # Am add9 stab, ringing
    add_st(38.0, saw_pluck(note(n), 3.8, 1.1, 1800, 0.004), 0.07, random.uniform(-0.6, 0.6), send=0.5)

# ── pad: continuous chords, ducked under every kick ─────────────────────
kick_times.sort()
# Sidechain curve, precomputed: each kick pulls the pad and bass down and lets
# them swell back, which is what makes the groove pump
DUCK = array.array("f", [1.0]) * N
for kt in kick_times:
    i0 = int(kt * SR)
    for k in range(int(0.5 * SR)):
        if i0 + k < N:
            DUCK[i0 + k] = 1.0 - 0.6 * math.exp(-(k / SR) * 9)

CHORD_F = [[note(n) for n in c] for c in CHORDS]
def chord_index(t):
    if t < 4.0 or t >= 36.0:
        return 0
    return int(((t - 4.0) % 8.0) // 2.0)

DETUNE = [2 ** (-0.07 / 12), 1.0, 2 ** (0.07 / 12)]
PANL = [0.75, 0.5, 0.25]
PANR = [0.25, 0.5, 0.75]
phases = [random.random() for _ in range(9)]
lp_l = lp_r = 0.0
for i in range(N):
    t = i / SR
    freqs = CHORD_F[chord_index(t)]
    sl = sr = 0.0
    j = 0
    for base in freqs:
        for v in range(3):
            p = phases[j] + base * DETUNE[v] / SR
            if p >= 1.0:
                p -= 1.0
            phases[j] = p
            x = 2 * p - 1
            sl += x * PANL[v]
            sr += x * PANR[v]
            j += 1
    if t < 2.0:
        cutoff = 300 + 1100 * (t / 2.0)
    elif t < 36.0:
        cutoff = 1500
    elif t < 38.0:
        cutoff = 1500 - 1000 * ((t - 36.0) / 2.0)
    else:
        cutoff = 900
    a = 1 - math.exp(-2 * math.pi * cutoff / SR)
    lp_l += a * (sl - lp_l)
    lp_r += a * (sr - lp_r)
    if t < 2.0:
        lvl = (t / 2.0) ** 1.5
    elif t > 39.0:
        lvl = max(0.0, 1 - (t - 39.0) / 3.0)
    else:
        lvl = 1.0
    g = 0.05 * lvl * DUCK[i]
    L[i] += lp_l * g
    R[i] += lp_r * g
    VERB[i] += (lp_l + lp_r) * g * 0.15

# Outro low-pass on the drums/bass bus too: approximate by a gentle level dip
# is not enough, so filter the whole mix 36-38 before the final hit
def lowpass_region(buf, t0, t1, c0, c1):
    i0, i1 = int(t0 * SR), int(t1 * SR)
    y = buf[i0]
    for i in range(i0, i1):
        p = (i - i0) / (i1 - i0)
        c = c0 * (c1 / c0) ** p
        a = 1 - math.exp(-2 * math.pi * c / SR)
        y += a * (buf[i] - y)
        buf[i] = y
lowpass_region(L, 36.0, 38.0, 12000, 700)
lowpass_region(R, 36.0, 38.0, 12000, 700)

# ── reverb send: small Schroeder (4 combs, 2 allpasses) ─────────────────
def comb(src, delay_s, fb, damp=0.3):
    d = int(delay_s * SR)
    out = array.array("f", [0.0]) * N
    store = 0.0
    for i in range(N):
        y = out[i - d] if i >= d else 0.0
        store = y * (1 - damp) + store * damp
        out[i] = src[i] + store * fb
    return out

def allpass(src, delay_s, g=0.5):
    d = int(delay_s * SR)
    out = array.array("f", [0.0]) * N
    for i in range(N):
        x = src[i]
        yd = out[i - d] if i >= d else 0.0
        xd = src[i - d] if i >= d else 0.0
        out[i] = -g * x + xd + g * yd
    return out

print("reverb...", flush=True)
wet = array.array("f", [0.0]) * N
for d_s, fb in ((0.0297, 0.80), (0.0371, 0.79), (0.0411, 0.78), (0.0437, 0.77)):
    c = comb(VERB, d_s, fb)
    for i in range(N):
        wet[i] += c[i] * 0.25
wet = allpass(allpass(wet, 0.005), 0.0017)
off = int(0.011 * SR)   # a touch wider on the right
for i in range(N):
    L[i] += wet[i] * 0.55
    R[i] += (wet[i - off] if i >= off else 0.0) * 0.55

# ── master: soft clip, then normalise to -1 dBFS ────────────────────────
drive = 1.4
norm = math.tanh(drive)
peak = 0.0
for i in range(N):
    L[i] = math.tanh(L[i] * drive) / norm
    R[i] = math.tanh(R[i] * drive) / norm
    peak = max(peak, abs(L[i]), abs(R[i]))
gain = (10 ** (-1 / 20)) / peak
# short fade-out on the final samples so the file ends in silence
fade = int(0.4 * SR)
pcm = array.array("h")
for i in range(N):
    f = min(1.0, (N - i) / fade)
    pcm.append(int(max(-1, min(1, L[i] * gain * f)) * 32767))
    pcm.append(int(max(-1, min(1, R[i] * gain * f)) * 32767))

out = sys.argv[1] if len(sys.argv) > 1 else "nexa-reel-score.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", out, f"{LENGTH}s", "peak gain", round(gain, 3))
