-- Sellitool — schema inicial (Cloudflare D1)
CREATE TABLE IF NOT EXISTS items (
  id          TEXT PRIMARY KEY,
  status      TEXT NOT NULL,
  data        TEXT NOT NULL,            -- JSON completo do item (mesmo formato do localStorage)
  created_at  INTEGER NOT NULL,
  updated_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id     TEXT NOT NULL,
  type        TEXT NOT NULL,            -- criado | enviado_aprovacao | publicado | reprovado | mensagem | visita | oferta | vendido | retirado | acao | preco | editado | excluido | importado
  meta        TEXT,                     -- JSON livre (canal, valor, nota...)
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_item ON events(item_id, created_at);
