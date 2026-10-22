"""
Pull the segments the showreel uses out of the project films and stills,
pre-cropped to 1920x1080, into seq/<shot>/f0001.jpg... and img/.
Writes counts.json, which index.html reads to clamp each shot's frames.

    python3 tools/showreel/extract.py   (from the repo root; needs ffmpeg on PATH or FFMPEG=...)
"""
import json, os, shutil, subprocess
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECTS = os.path.join(HERE, "..", "..", "public", "projects")
FF = os.environ.get("FFMPEG", "ffmpeg")

cfg = json.load(open(os.path.join(HERE, "shots.json")))
counts = {}
for sid, src, t_in, dur in cfg["seq"]:
    out = os.path.join(HERE, "seq", sid)
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    subprocess.run([FF, "-y", "-ss", str(t_in), "-i", os.path.join(PROJECTS, src), "-t", str(dur),
                    "-vf", "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080",
                    "-q:v", "3", os.path.join(out, "f%04d.jpg")], capture_output=True, check=True)
    counts[sid] = len(os.listdir(out))

os.makedirs(os.path.join(HERE, "img"), exist_ok=True)
for rel in cfg["img"]:
    im = Image.open(os.path.join(PROJECTS, rel)).convert("RGB")
    s = max(1920 / im.width, 1080 / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - 1920) // 2, (im.height - 1080) // 2
    im.crop((l, t, l + 1920, t + 1080)).save(os.path.join(HERE, "img", os.path.basename(rel)), quality=90)

json.dump(counts, open(os.path.join(HERE, "counts.json"), "w"))
print(counts)
