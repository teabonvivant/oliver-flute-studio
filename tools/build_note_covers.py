#!/usr/bin/env python3
"""由舊站真實相片裁出手記封面：content/note-covers.json → assets/images/notes/<slug>[-640|-1024].webp"""
import json, os
from PIL import Image
C = json.load(open('content/note-covers.json', encoding='utf8'))
OUT = 'assets/images/notes'
os.makedirs(OUT, exist_ok=True)
for slug, c in C.items():
    im = Image.open(f"assets/images/legacy/{c['photo']}.webp").convert('RGB')
    w, h = im.size
    cw, ch = (w, round(w * 2 / 3)) if w * 2 / 3 <= h else (round(h * 3 / 2), h)
    x = round((w - cw) * c.get('x', .5))
    y = round((h - ch) * c.get('y', .3))
    im = im.crop((x, y, x + cw, y + ch))
    for suf, tw in (('-640', 640), ('-1024', 1024), ('', max(cw, 1024))):
        r = im.resize((tw, round(tw * 2 / 3)), Image.LANCZOS)
        r.save(f'{OUT}/{slug}{suf}.webp', quality=74, method=6)
print(len(C), OUT)
