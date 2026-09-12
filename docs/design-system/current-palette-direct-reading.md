# Rigour and precision — The direct reading

**Reading:** The direct reading  
**Piece:** App or digital product  
**Medium:** Screen  
**Intention:** Rigour and precision  
**Field:** None  
**Scheme:** Analogous  
**Studio lens:** Pentagram — London and New York  
**Cultural reference:** None  
**Musical style:** None  
**Stance:** 57 of 100  

Stays within what the field already recognises and spends the difference on precision, not volume. It is the proposal that does not need defending in a meeting.

## Palette

| # | Name | HEX | RGB | HSL | CMYK | OKLCH | Area |
|---|---|---|---|---|---|---|---|
| 1 | Pale lagoon | `#E0F8FF` | 224, 248, 255 | 194, 100, 94 | 12, 3, 0, 0 | 96% 0.027 217 | 73% |
| 2 | Deep amethyst | `#0F1532` | 15, 21, 50 | 230, 54, 13 | 70, 58, 0, 80 | 21% 0.058 272 | 18% |
| 3 | Mint | `#378C5E` | 55, 140, 94 | 148, 44, 38 | 61, 0, 33, 45 | 58% 0.109 157 | 7% |
| 4 | Lavender | `#BBB2FF` | 187, 178, 255 | 247, 100, 85 | 27, 30, 0, 0 | 80% 0.108 289 | 3% |

Suggested ground `#E0F8FF`, text `#0F1532`, contrast 16.22 to 1.

### Legible pairs at 4.5 to 1

- `#0F1532` sobre `#E0F8FF` (16.22)
- `#E0F8FF` sobre `#0F1532` (16.22)
- `#BBB2FF` sobre `#0F1532` (9.31)
- `#0F1532` sobre `#BBB2FF` (9.31)

## Type

| Role | Family | Library | Weights | Character |
|---|---|---|---|---|
| Headline | Jost | Google Fonts | 300, 400, 500, 600, 700 | geometric sans, medium x-height, almost no contrast, serves headline and text. |
| Text | IBM Plex Serif | Google Fonts | 300, 400, 500, 600, 700 | transitional serif, medium x-height, moderate contrast, serves headline and text. |
| Support | IBM Plex Mono | Google Fonts | 300, 400, 500, 600, 700 | monospaced, medium x-height, almost no contrast, monospaced. |

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@300;400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap">
```

## CSS variables

```css
:root{
  --cor-1: #E0F8FF;
  --cor-2: #0F1532;
  --cor-3: #378C5E;
  --cor-4: #BBB2FF;
  --fundo: #E0F8FF;
  --tinta: #0F1532;
  --fonte-1: "Jost", system-ui, sans-serif;
  --fonte-2: "IBM Plex Serif", Georgia, serif;
  --fonte-3: "IBM Plex Mono", ui-monospace, monospace;
}
```

---

Derived from Goethe's colour circle (*Zur Farbenlehre*, 1810). Conversions in OKLab, chroma adjusted to the sRGB gamut. Contrast ratios to WCAG 2.1. Generated on 13/09/2026, 08:59:25.
