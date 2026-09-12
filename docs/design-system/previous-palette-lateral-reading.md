# Rigour and precision in property and architecture — The lateral reading

**Reading:** The lateral reading  
**Piece:** App or digital product  
**Medium:** Screen  
**Intention:** Rigour and precision  
**Field:** Property and architecture  
**Scheme:** Goethe — characteristic  
**Studio lens:** Pentagram — London and New York  
**Cultural reference:** Aotearoa — kōkōwai, pango, mā  
**Musical style:** Modal jazz  
**Stance:** 83 of 100  

> An app to sell items on the web.  

Comes in by a route nobody asked for: it changes the axis of the problem, whether through cultural reference, dynamics or the quantity of colour. It is the one that usually opens the conversation.

## Palette

| # | HEX | RGB | HSL | CMYK | OKLCH | Area |
|---|---|---|---|---|---|---|
| 1 | `#FFFCFF` | 255, 252, 255 | 300, 100, 99 | 0, 1, 0, 0 | 99% 0.005 326 | 76% |
| 2 | `#170000` | 23, 0, 0 | 0, 100, 5 | 0, 100, 100, 91 | 13% 0.053 29 | 16% |
| 3 | `#00958E` | 0, 149, 142 | 177, 100, 29 | 100, 0, 5, 42 | 60% 0.105 189 | 6% |
| 4 | `#FFA860` | 255, 168, 96 | 27, 100, 69 | 0, 34, 62, 0 | 80% 0.135 59 | 2% |

Suggested ground `#FFFCFF`, text `#170000`, contrast 19.90 to 1.

### Legible pairs at 4.5 to 1

- `#170000` sobre `#FFFCFF` (19.90)
- `#FFFCFF` sobre `#170000` (19.90)
- `#00958E` sobre `#170000` (5.49)
- `#FFA860` sobre `#170000` (10.63)
- `#170000` sobre `#00958E` (5.49)
- `#170000` sobre `#FFA860` (10.63)

## Type

| Role | Family | Library | Weights | Character |
|---|---|---|---|---|
| Headline | Alegreya | Google Fonts | 400, 500, 700, 800 | humanist serif, medium x-height, moderate contrast, serves headline and text. |
| Text | Alegreya Sans | Google Fonts | 300, 400, 500, 700, 800 | humanist sans, medium x-height, almost no contrast, serves headline and text. |
| Support | IBM Plex Mono | Google Fonts | 300, 400, 500, 600, 700 | monospaced, medium x-height, almost no contrast, monospaced. |

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@300;400;500;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap">
```

## CSS variables

```css
:root{
  --cor-1: #FFFCFF;
  --cor-2: #170000;
  --cor-3: #00958E;
  --cor-4: #FFA860;
  --fundo: #FFFCFF;
  --tinta: #170000;
  --fonte-1: "Alegreya", Georgia, serif;
  --fonte-2: "Alegreya Sans", system-ui, sans-serif;
  --fonte-3: "IBM Plex Mono", ui-monospace, monospace;
}
```

---

Derived from Goethe's colour circle (*Zur Farbenlehre*, 1810). Conversions in OKLab, chroma adjusted to the sRGB gamut. Contrast ratios to WCAG 2.1. Generated on 13/09/2026, 07:29:10.
