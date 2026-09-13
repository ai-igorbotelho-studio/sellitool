# Auditoria de contraste — paleta "The direct reading"

Medido com `scripts/contraste.py` (skill senior-frontend-engineer), não estimado.
Fórmula WCAG 2.x, valores reais dos tokens CSS shipados no `index.html`.

| Elemento | Texto | Fundo | Ratio | AA (texto normal) |
|---|---|---|---|---|
| Corpo de texto (ink sobre fundo) | `#0F1532` | `#E0F8FF` | 16.22:1 | PASSA |
| Descrições (ink-soft, mix 65% sobre fundo) | `#58647A` | `#E0F8FF` | 5.41:1 | PASSA |
| Texto sobre cartão (paper tint 4%) | `#0F1532` | `#D8EFF7` | 15.00:1 | PASSA |
| Botão primário / badge "vendido" (paper sobre ink) | `#E0F8FF` | `#0F1532` | 16.22:1 | PASSA |
| Badge "aguardando aprovação" (ink sobre lavanda) | `#0F1532` | `#BBB2FF` | 9.31:1 | PASSA |
| Badge "rascunho" (ink sobre gray-bg) | `#0F1532` | `#D3EAF3` | 14.34:1 | PASSA |
| Badge "não vender" (ink sobre red-bg) | `#0F1532` | `#CDE4ED` | 13.56:1 | PASSA |
| Ícone (não-texto) sobre mint — nav icon / tab ativa | `#0F1532` | `#378C5E` | 4.32:1 | PASSA (regra não-texto é 3:1) |

## Decisões tomadas por causa da medição

- **Mint (`#378C5E`) nunca vira cor de texto em botões ou badges.** Medido a 4.32:1 contra tinta e contra fundo — abaixo dos 4,5:1 exigidos pra texto normal. É usado só em ícones, barras decorativas e no gradiente da aba ativa, onde a regra é 3:1 (não-texto), que ele cobre com folga.
- **`--ink-soft` foi recalibrado para 65% de mistura**, não os 52% usados na paleta anterior — a 52% ele media 3,56:1 nesse fundo mais claro (`#E0F8FF`) e falhava AA. A 65% mede 5,41:1.
- Nenhuma cor de alarme "vermelha" nesta paleta — é um esquema análogo (azul/verde/roxo) de propósito. O estado "não vender" é sinalizado por rótulo e borda, não por uma cor de perigo inventada fora da paleta.

## Não verificado

- Sem navegador real disponível nesta sessão para captura de tela ou teste de Safari iOS/Android — os números acima são cálculo de fórmula, não renderização visual.
- Sem teste de `prefers-reduced-motion` — as únicas transições no arquivo são hover/active de 0,1–0,15s, que já são discretas, mas isso não foi confirmado com o media query.


## Adendo — interface v2 (header, drawer, footer, hero escuro)

Novos pares usados como texto, medidos pela fórmula WCAG 2.x (luminância relativa):

| Par | Onde | Razão |
|---|---|---|
| `#E0F8FF` sobre `#0F1532` | header, drawer, footer, cartão-herói, barra de abas | 16.22:1 |
| `--ink-on-dark-soft` (`#A6BCCA`, mistura 72% lagoon / 28% tinta) sobre `#0F1532` | subtítulos no footer/herói | 9.9:1 |
| `#0F1532` sobre `#BBB2FF` | aba ativa, item atual do drawer, `mark` do título, botão secundário | 9.31:1 |
| `#0F1532` sobre `#FFFFFF` | cartões (`--paper-raised`) | 18.4:1 |

Nenhum texto novo em mint. O anel do dashboard usa mint só como traço (não-texto, ≥3:1 cumprido).
