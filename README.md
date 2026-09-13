# Sellitool

Ferramenta pessoal do Igor pra listar, acompanhar e fechar vendas de itens e do carro (Ostend, Waiheke Island), com biblioteca de respostas em NZ English pro Trade Me e Facebook Marketplace.

## O que é

Um único arquivo HTML/CSS/JS, sem build, sem dependência de servidor, mais a pasta `assets/` (ícone, logo, imagem de compartilhamento e manifest). Os dados ficam em `localStorage` no navegador. Pensado pra publicar como site estático (GitHub + Cloudflare Pages).

## Rodar localmente

Abra `index.html` direto no navegador, ou sirva a pasta com qualquer servidor estático:

```
npx serve .
```

## Publicar (GitHub + Cloudflare Pages)

O repositório já está conectado ao Cloudflare Pages.

- Build command: vazio (não há build).
- Build output directory: `/` (raiz).
- Cada push no branch de produção redeploya automaticamente. Pushes em outros branches geram um preview deploy com URL própria.

`_headers` na raiz define cabeçalhos de segurança e cache pro Cloudflare Pages.

## Interface (v2)

- Header fixo em tinta (`--tinta`) com logo e menu hamburguer que abre um drawer com todas as páginas; footer no mesmo tom.
- Home com saudação, headline com destaque em lavanda, cartão-herói escuro com total à venda, pílulas de acesso rápido e cartões de etapa com tilt e spotlight ao passar o mouse.
- Barra de abas flutuante (pílula escura) que se esconde ao rolar pra baixo e mostra o rótulo da aba ativa.
- Movimento: transição entre páginas, revelação escalonada por `IntersectionObserver`, parallax de fundo por ponteiro/rolagem/giroscópio (escrito em variáveis CSS num único `requestAnimationFrame`). Tudo desliga com `prefers-reduced-motion`.
- SEO por página: `document.title`, `meta description` e Open Graph mudam a cada navegação (tabela `SEO` no script) e a URL ganha `#pagina`, que também funciona como rota ao abrir.
- Identidade: `assets/icon.svg` (etiqueta de preço com S, ponto mint), `assets/logo.svg`, PNGs 32/180/192/512, `assets/og-image.png` 1200×630 e `assets/site.webmanifest`.

## Sistema de design em uso

Paleta e tipografia vêm de `docs/design-system/current-palette-direct-reading.md` ("Rigour and precision — the direct reading", esquema análogo, Goethe/Farbenkreis). A versão anterior está preservada em `docs/design-system/previous-palette-lateral-reading.md` pra histórico.

- Cor: `--cor-1` `#E0F8FF` (fundo), `--cor-2` `#0F1532` (tinta), `--cor-3` `#378C5E` (mint — só ícones e estados, nunca texto pequeno), `--cor-4` `#BBB2FF` (lavanda — badges de atenção).
- Tipo: Jost (headline), IBM Plex Serif (texto/corpo), IBM Plex Mono (dados/números).
- Ver `docs/contrast-audit.md` pros números reais de contraste WCAG por trás dessas escolhas.

## Nuvem (Fase 1)

Com D1, R2 e a senha configurados no Cloudflare (ver `docs/deploy-cloudflare.md`), os dados ficam na nuvem e sincronizam entre aparelhos, as fotos vão pro R2 e cada mudança de status gera um evento na linha do tempo. Sem essa configuração, o app roda em modo local.

## Limitações conhecidas (não é bug, é decisão registrada)

- **Sem a nuvem configurada, dados são por navegador.** Exportar/Importar CSV (na tela "Ferramentas") é o backup manual nesse modo.
- **Sync automático com Google Sheets não está implementado** — exigiria OAuth ou um Google Apps Script publicado pelo próprio Igor. Não é feito por segurança (nenhuma credencial é digitada em nome do usuário).
- **Sem posting automático no Trade Me/Facebook.** Não existe API pública legítima pra isso; o caminho real é usar o Claude in Chrome como "braço" pra publicar e responder, com esta ferramenta como o "cérebro" central.

## Continuando este projeto no Claude Code

Este repositório já traz os dois arquivos de skill usados pra construí-lo, caso o ambiente do Claude Code não os tenha instalados como plugin:

- `docs/skills/senior-frontend-engineer.md` — disciplina de fases (entender → decidir → construir → endurecer → publicar), a regra de medir contraste em vez de estimar, e o formato de relatório de auditoria.
- `docs/skills/frontend-design.md` — como evitar os "tells" genéricos de design gerado por IA (cartões idênticos, mesma sombra em tudo, eyebrow em caixa alta, gradiente decorativo sem função) e como ancorar decisões visuais no brief.

Veja também `CLAUDE.md` na raiz — é o arquivo que o Claude Code lê automaticamente ao abrir este projeto.
