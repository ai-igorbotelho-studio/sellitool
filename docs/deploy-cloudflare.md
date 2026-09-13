# Fase 1 — Nuvem no Cloudflare (D1 + R2 + senha)

Tudo continua sem build. O Cloudflare Pages compila a pasta `functions/` sozinho.
Sem estas configurações a ferramenta segue funcionando em modo local (só no navegador).

## 1. Banco de dados (D1)

No terminal, com o Wrangler logado (`npx wrangler login`):

```
npx wrangler d1 create sellitool
```

Copie o `database_id` que aparece e cole em `wrangler.toml` no lugar de `REPLACE_WITH_YOUR_D1_DATABASE_ID`.
Depois crie as tabelas:

```
npx wrangler d1 execute sellitool --remote --file migrations/0001_init.sql
```

## 2. Fotos (R2)

```
npx wrangler r2 bucket create sellitool-photos
```

## 3. Ligar os bindings no projeto Pages

Dashboard → Workers & Pages → sellitool → Settings → Bindings:

| Tipo | Nome da variável | Recurso |
|---|---|---|
| D1 database | `DB` | `sellitool` |
| R2 bucket | `PHOTOS` | `sellitool-photos` |

(Se o projeto ler o `wrangler.toml` do repositório, esses dois já vêm de lá; confira que aparecem.)

## 4. Senha

Settings → Environment variables → **Add** → `SELLITOOL_PASSWORD` → marque **Encrypt**. Use uma senha longa. Salve para Production (e Preview, se quiser testar em previews).

## 5. Redeploy

Deployments → Retry deployment (ou faça um push). Ao abrir o site, aparece a tela de senha. No primeiro login, os items que estavam só no navegador sobem automaticamente pro D1.

## Como funciona

- `GET /api/status` diz se a nuvem está configurada; sem ela, o app fica em modo local.
- Sessão: cookie HttpOnly assinado (HMAC-SHA256 com a própria senha como segredo), 30 dias.
- `items`: um registro por item, JSON completo em `data` (mesmo formato do localStorage).
- `events`: linha do tempo por item (criado, publicado, mensagem, visita, oferta, vendido...). Alimenta "Atividade recente" no dashboard e as fases 3 e 4.
- Fotos: sobem pro R2 redimensionadas a 1600px; o item guarda só a URL `/api/photos/<key>`. As fotos são privadas (passam pela sessão).
- localStorage continua como cache: se a nuvem falhar, o app avisa e guarda localmente.

## Testar localmente

```
npx wrangler d1 execute sellitool --local --file migrations/0001_init.sql
npx wrangler pages dev . --binding SELLITOOL_PASSWORD=teste
```
