# Schema V2

Esse modelo evita os problemas do banco atual porque nao usa uma unica tabela de conexoes soltas entre estacoes.

## Ideia

- `estacoes`: lugar fisico real
- `linhas`: metadados da linha
- `paradas_linha`: a mesma estacao pode existir em varias linhas
- `trechos_linha`: so ligacoes consecutivas da mesma linha
- `baldeacoes`: trocas entre linhas na mesma estacao

## Exemplo

`Engenheiro Goulart` existe uma vez em `estacoes`, mas tem duas entradas em `paradas_linha`:

- Linha 12
- Linha 13

E a troca entre elas fica em `baldeacoes`.

## Vantagens

- impede atalhos irreais como ligar estacoes distantes so porque ambas sao baldeacao
- separa deslocamento de linha e troca de linha
- facilita mostrar o percurso por trechos
- facilita calcular sentido da linha

## Migracao sugerida

1. Popular `linhas`
2. Popular `estacoes` sem duplicar nomes fisicos
3. Criar `paradas_linha` a partir da ordem de cada linha
4. Gerar `trechos_linha` apenas entre ordens consecutivas da mesma linha
5. Criar `baldeacoes` para estacoes que aparecem em mais de uma linha
6. Adaptar o app para usar `paradas_linha` no grafo
