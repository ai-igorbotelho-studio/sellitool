# Contexto do projeto — Sellitool

Leia `README.md` primeiro. Este arquivo é só o resumo operacional pro Claude Code.

## Stack

HTML/CSS/JS puro, um arquivo (`index.html`) mais `assets/` (ícones, logo, og-image, manifest), sem build, sem framework. Deploy alvo: GitHub + Cloudflare Pages (estático, sem build, output na raiz). Não adicione um bundler, React ou build step sem perguntar antes — a decisão de ficar sem build foi deliberada (Fase 3 do senior-frontend-engineer, ver `docs/skills/senior-frontend-engineer.md`).

## Antes de mexer no código

1. Leia `docs/skills/senior-frontend-engineer.md` — em especial as três regras (medir, localizar, não redesenhar na fase de endurecimento) e o ciclo de seis fases. Qualquer alteração visual ou estrutural nova começa na Fase 1 (entender), não direto no código.
2. Leia `docs/skills/frontend-design.md` — antes de adicionar qualquer elemento decorativo (sombra, gradiente, eyebrow, ícone), cheque contra a lista de "tells" genéricos na seção "Process: plan, review against the brief, build, critique". Este projeto já removeu alguns desses tells de uma versão anterior (eyebrow em caixa alta, sombra idêntica em todo cartão, gradiente de fundo decorativo) — não reintroduza sem justificativa ligada ao brief.
3. Leia `docs/design-system/current-palette-direct-reading.md` — é a fonte da verdade pra cor e tipografia. Qualquer nova cor ou fonte tem que vir de lá, não inventada.
4. Antes de usar uma cor nova como texto, meça o contraste com `docs/skills/senior-frontend-engineer.md` → `scripts/contraste.py` (ou equivalente) e registre o número em `docs/contrast-audit.md`. Não estime — a paleta atual já tem uma cor (mint) que falha AA como texto pequeno e só é segura em ícones/estados; isso foi descoberto medindo, não olhando.

## Convenções já em uso no CSS

- Tokens de cor em `:root` como `--cor-1..4`, `--fundo`, `--tinta`, com tokens derivados (`--ink-soft`, `--line`, `--paper`, etc.) via `color-mix()`. Adicione novos tokens derivados do mesmo jeito em vez de hexadecimais soltos no meio das regras.
- `--radius` (22px) é só pros cartões de navegação da Home (o elemento "herói" da interface). `--radius-sm` (12px) é pra tudo secundário (fieldset, card de item, stat, reply-card). Não unifique os dois — a diferença é hierarquia intencional, não inconsistência.
- Sombra (`--shadow-hover`) só aparece em estados (hover do nav-card, aba ativa da tab bar) — nunca estática em todo container. Se for adicionar sombra em algo novo, pergunte-se se é decoração ou resposta a uma ação/estado.
- Movimento vive em variáveis CSS (`--px`, `--py`, `--sy`, `--mx`, `--my`, `--rx`, `--ry`) escritas pelo JS num único `requestAnimationFrame`; não adicione listeners de scroll/pointer paralelos — alimente as mesmas variáveis.
- Elementos com `.reveal` entram via `IntersectionObserver` (`revealIn()`); há um fallback de 1,4s que força `.in` pra nunca deixar conteúdo invisível.
- Todo texto sobre `--tinta` usa `--cor-1` ou `--ink-on-dark-soft`; sobre `--lavender` usa `--ink`. Mint continua só em ícones, barras e anel do gráfico.
- Ao criar página nova: adicionar `<section class="page" id="page-x">`, uma entrada na tabela `SEO`, um botão no drawer (`data-page="x"`) e no footer.
- Persistência: `backend.mode` é `local`, `locked` (nuvem configurada, sem sessão) ou `cloud`. `saveItems(item, event)` grava localStorage sempre e, em `cloud`, faz `PUT /api/items/:id` com o evento. Toda mudança de status deve passar um evento (tipos válidos em `functions/api/events.js`).
- Backend em `functions/` (Pages Functions, ES modules, sem build): `_lib.js` (sessão HMAC, helpers), `api/_middleware.js` (exige sessão em tudo menos login/logout/status), `api/items`, `api/events`, `api/photos`. Schema em `migrations/`. Passo a passo em `docs/deploy-cloudflare.md`.
- Chave do localStorage continua `vv_items_v1`; o JSON do item no D1 é o mesmo objeto.

## Não fazer sem perguntar

- Publicar ou dar deploy em produção.
- Adicionar OAuth/Google Sheets sync com credenciais embutidas no código.
- Mudar o formato do cookie de sessão ou afrouxar o middleware de `/api/*`.
- Trocar a stack (framework, bundler) sem antes confirmar com o Igor — ver Fase 1 do senior-frontend-engineer.
