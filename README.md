# Metro SP

Aplicação web focada em consulta de rotas, linhas e estações do sistema metroferroviário de São Paulo, com interface pensada para funcionar bem no celular.

## Acesso

Use no celular por este link:

`https://iemaneul.github.io/metro-sp/`

Sugestão: abra direto no navegador do celular para testar a experiência mobile, especialmente a busca de origem e destino.

## O que o projeto faz

- Definir rota entre estações
- Exibir o resultado do trajeto com tempo estimado
- Mostrar linhas disponíveis do sistema
- Abrir os detalhes de cada linha
- Listar as estações em ordem
- Mostrar baldeações das estações na visualização da linha

## Telas atuais

- Home com atalhos principais
- Definição de rota
- Resultado da rota
- Listagem de linhas
- Detalhe da linha
- Página inicial de mapa para evolução futura

## Tecnologias usadas

### Base da aplicação

- `HTML5`
- `CSS3`
- `JavaScript` puro (`Vanilla JS`)
- `ES Modules` com `script type="module"`

### Backend / dados

- `Supabase`
- Banco consultado via API usando o cliente oficial do Supabase

### Bibliotecas e serviços externos

- `@supabase/supabase-js`
  Fonte: carregada via `jsDelivr CDN`
- `Google Fonts`
  Fonte usada: `Poppins`

### Hospedagem

- `GitHub Pages`

## Frameworks

Este projeto atualmente **não usa framework frontend** como React, Vue, Angular, Next ou similares.

Toda a interface foi construída com HTML, CSS e JavaScript puro.

## Estrutura principal

- [index.html](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/index.html): página inicial
- [pages/routes.html](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/pages/routes.html): tela para definir rota
- [pages/result.html](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/pages/result.html): resultado da rota
- [pages/lines.html](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/pages/lines.html): listagem das linhas
- [pages/line-detail.html](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/pages/line-detail.html): detalhe de cada linha
- [js/app.js](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/js/app.js): lógica principal de rotas
- [js/lines.js](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/js/lines.js): listagem e detalhe das linhas
- [js/api.js](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/js/api.js): consultas de dados
- [js/supabase.js](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/js/supabase.js): configuração do Supabase
- [css/style.css](/home/emanuel.costa@ikatec.com.br/Área%20de%20trabalho/metro-sp/css/style.css): estilos globais

## Como rodar

Como o projeto é estático e usa JavaScript no navegador, basta abrir a URL publicada:

`https://iemaneul.github.io/metro-sp/`

Se quiser rodar localmente, você pode servir a pasta do projeto com qualquer servidor estático simples.

## Observações

- A experiência principal está sendo tratada com bastante foco em mobile
- A busca de estações foi adaptada para funcionar melhor em navegadores de celular
- O mapa ainda está em construção e pode evoluir depois

## Autor

Projeto publicado em:

`https://iemaneul.github.io/metro-sp/`
