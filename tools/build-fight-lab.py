#!/usr/bin/env python3
"""Builds fight-lab.html: the fight lab's own page on top of the game's engine.

The game is one file, so the lab cannot import its parts. This copies them instead:
the whole <style> (palette, pixel UI kit, fonts) and the script from its start up to the UI
(rules, palette, pixel renderer, sprites, scenes, audio). index.html itself is only read.

Run from the repository root:  python3 tools/build-fight-lab.py
"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent
game = (root / 'index.html').read_text(encoding='utf-8')
src = (root / 'tools' / 'fight-lab.src.html').read_text(encoding='utf-8')


def between(text, start, end):
    a = text.index(start) + len(start)
    return text[a:text.index(end, a)]


style = between(game, '<style>', '</style>')
engine = between(game, "(()=>{\n'use strict';", '/* ui/base.js */')

out = src.replace('/*@@STYLE@@*/', style).replace('/*@@ENGINE@@*/', engine)
assert '@@' not in out, 'a placeholder was left unfilled'
(root / 'fight-lab.html').write_text(out, encoding='utf-8')
print(f'fight-lab.html: {len(out) // 1024} KB')
