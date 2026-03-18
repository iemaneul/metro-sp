-- Modelo sugerido para rotas de metro/CPTM sem atalhos irreais.
-- A ideia central e separar:
-- 1. a estacao fisica (onde a pessoa realmente esta)
-- 2. a presenca dessa estacao em cada linha
-- 3. os trechos consecutivos de cada linha
-- 4. as baldeacoes entre plataformas/linhas quando existirem

create table if not exists linhas (
  id bigint generated always as identity primary key,
  numero text not null,
  nome text not null,
  cor text not null,
  text_color text not null,
  operadora text,
  ativo boolean not null default true,
  unique (numero)
);

create table if not exists estacoes (
  id bigint generated always as identity primary key,
  nome text not null,
  slug text unique,
  municipio text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  ativo boolean not null default true
);

-- Uma "parada" representa a estacao dentro de uma linha especifica.
-- Exemplo:
-- - Bras na Linha 3
-- - Bras na Linha 11
-- - Engenheiro Goulart na Linha 12
-- - Engenheiro Goulart na Linha 13
create table if not exists paradas_linha (
  id bigint generated always as identity primary key,
  linha_id bigint not null references linhas(id) on delete cascade,
  estacao_id bigint not null references estacoes(id) on delete cascade,
  ordem integer not null,
  nome_exibicao text,
  plataforma text,
  ativo boolean not null default true,
  unique (linha_id, ordem),
  unique (linha_id, estacao_id)
);

create index if not exists idx_paradas_linha_estacao_id
  on paradas_linha (estacao_id);

create index if not exists idx_paradas_linha_linha_id_ordem
  on paradas_linha (linha_id, ordem);

-- Trechos reais entre paradas consecutivas da mesma linha.
-- Aqui nao entra baldeacao. So deslocamento operacional da linha.
create table if not exists trechos_linha (
  id bigint generated always as identity primary key,
  linha_id bigint not null references linhas(id) on delete cascade,
  parada_origem_id bigint not null references paradas_linha(id) on delete cascade,
  parada_destino_id bigint not null references paradas_linha(id) on delete cascade,
  tempo_segundos integer not null check (tempo_segundos > 0),
  distancia_metros integer,
  bidirecional boolean not null default true,
  unique (parada_origem_id, parada_destino_id)
);

create index if not exists idx_trechos_linha_origem
  on trechos_linha (parada_origem_id);

create index if not exists idx_trechos_linha_destino
  on trechos_linha (parada_destino_id);

-- Baldeacao entre paradas de linhas diferentes na mesma estacao fisica.
-- Exemplo:
-- - Bras L3 <-> Bras L11
-- - Engenheiro Goulart L12 <-> Engenheiro Goulart L13
create table if not exists baldeacoes (
  id bigint generated always as identity primary key,
  estacao_id bigint not null references estacoes(id) on delete cascade,
  parada_origem_id bigint not null references paradas_linha(id) on delete cascade,
  parada_destino_id bigint not null references paradas_linha(id) on delete cascade,
  tempo_segundos integer not null default 180 check (tempo_segundos > 0),
  observacao text,
  unique (parada_origem_id, parada_destino_id),
  check (parada_origem_id <> parada_destino_id)
);

create index if not exists idx_baldeacoes_estacao_id
  on baldeacoes (estacao_id);

-- Sentido da linha para exibir no resultado.
-- Permite mostrar "Vila Sonia - Luz" ou "Jundiai - Luz".
create or replace view vw_sentidos_linha as
select
  l.id as linha_id,
  l.numero,
  l.nome,
  p_inicio.estacao_id as terminal_inicial_id,
  e_inicio.nome as terminal_inicial_nome,
  p_fim.estacao_id as terminal_final_id,
  e_fim.nome as terminal_final_nome
from linhas l
join lateral (
  select pl.*
  from paradas_linha pl
  where pl.linha_id = l.id
  order by pl.ordem asc
  limit 1
) p_inicio on true
join estacoes e_inicio on e_inicio.id = p_inicio.estacao_id
join lateral (
  select pl.*
  from paradas_linha pl
  where pl.linha_id = l.id
  order by pl.ordem desc
  limit 1
) p_fim on true
join estacoes e_fim on e_fim.id = p_fim.estacao_id;

-- Como usar o modelo:
-- 1. buscar origem/destino na tabela estacoes
-- 2. transformar cada estacao nas suas paradas possiveis em paradas_linha
-- 3. montar o grafo com:
--    - trechos_linha como deslocamento normal
--    - baldeacoes como troca de linha
-- 4. rodar o algoritmo de rota sobre ids de paradas_linha
-- 5. agrupar o resultado por linha para montar a tela
