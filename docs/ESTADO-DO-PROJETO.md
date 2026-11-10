# Estado do projeto: tools

**Atualizado em 10/11/2026.** Este arquivo responde a três perguntas: onde o projeto está, o que já fizemos e o que queremos fazer. Para trazer conteúdo novo ou mudar o site, siga [`COMO-EVOLUIR.md`](COMO-EVOLUIR.md).

## Onde está

| Item | Situação |
|---|---|
| Produção | `https://douglasabnovato.github.io/tools/` (GitHub Pages, publicado a cada push na `main`) |
| Repositório | `main` protegida (check `verificar` obrigatório, sem force push). Fluxo: `feature/tasks-DD-MM-AAAA` → `developer` → `main`, só fast-forward |
| CI | `npm ci`, lint, `format:check`, 14 testes (`node --test`) e `verificar.ps1` |
| Conteúdo | 91 ferramentas e 12 hospedagens, com reserva local gerada pela API (`data/tools.js` e `data/host.js`) |
| Acessibilidade | axe (WCAG 2.2 AA) sem violação na home, nas hospedagens, no detalhe e no 404, nos temas claro e escuro (local, 10/11/2026) |
| Segurança | CSP por `<meta http-equiv>` nas três páginas; 404 próprio em `404.html` |

## O que fizemos

| Período | Entregas |
|---|---|
| Versões 1 a 3 | Do desafio de portfólio ao catálogo com descrição, modelo de cobrança, 12 categorias, busca sem acento e estado na URL (histórico no README) |
| 28 e 29/10 | Detalhes dos conteúdos e funções novas |
| 31/10 | Cópias da API, "Veja também" e tag Descontinuado |
| 03/11 | Testes na CI, ferramentas de lint e formato, Open Graph, sitemap, 7 ferramentas novas |
| 05/11, conteúdo | Lote 4: Supabase, Search Console, GitHub Actions, Playwright e Render |
| 05/11, MVP | Resposta tardia da API aproveitada sem recarregar; SEO do detalhe com `?id=` e canonical; abas por teclado; "Tentar novamente" no detalhe; `verificar.ps1` contando as cópias de verdade |
| 05/11, estabilidade | e2e contra a produção passando; `COMO-EVOLUIR.md`; README com os números reais |
| 06/11 | Este documento, README com o estado e issue nova (#60) |
| 10/11 | Contraste e nome acessível dos cards (#60); 404 e CSP (#59); logo em WebP (#55, miniaturas dos cards ficam na API) |

Detalhes: `docs/claudeia/diagnostico-mvp-2026-11-03.md` e `docs/claudeia/06-mvp-2026-11-03.md`.

## O que queremos fazer

Todas as issues têm o label `proximos-passos` e pelo menos três critérios de entrega. A ordem é a sugerida.

| Ordem | Issue | O quê | Tipo |
|---|---|---|---|
| 1 | [#55](https://github.com/douglasabnovato/tools/issues/55) | Miniaturas leves: WebP e tamanho padrão (cerca de 10 MB hoje) | performance |
| 2 | [#60](https://github.com/douglasabnovato/tools/issues/60) | Contraste de cor e nome acessível dos cards | acessibilidade |
| 3 | [#58](https://github.com/douglasabnovato/tools/issues/58) | Lighthouse, e2e e acessibilidade com relatório | qualidade |
| 4 | [#59](https://github.com/douglasabnovato/tools/issues/59) | Página 404 e Content-Security-Policy | frontend, segurança |
| 5 | [#56](https://github.com/douglasabnovato/tools/issues/56) | Filtro por modelo de cobrança | frontend |
| 6 | [#57](https://github.com/douglasabnovato/tools/issues/57) | Medição do catálogo: buscas, filtros e cliques | produto |

Também na fila, sem issue própria por enquanto: decidir entre captura de tela e favicon do serviço nas miniaturas, e revisar as hospedagens sem plano gratuito (Railway, Heroku).

Na #55, o que falta é trabalho na API: as 51 miniaturas JPG de `assets/thumb_tools` e `assets/thumb_host` (de 42 a 490 KB) são citadas só por `data/tools.js` e `data/host.js`, que são gerados. A conversão para WebP de até 30 KB e a troca do `thumb` entram por `learntech-content/content/tools/`, e as cópias chegam aqui por `npm run copias`.

As outras issues abertas (growth, copywriting, cases e formações) são **material de conteúdo**. Elas entram pela API, pelo processo de remessa do `learntech-content`.

## Decisões que dependem do autor
- Miniatura por captura de tela ou por favicon do serviço.
- Modal de identificação obrigatório ou opcional (learntech-content #5).

## Como manter este arquivo
Ao fim de cada rodada: acrescente uma linha em "O que fizemos", atualize "Onde está" com os números de `npm test` e das cópias, e troque as issues fechadas por novas em "O que queremos fazer". A visão do ecossistema fica em `learntech-content/docs/ESTADO-DO-PROJETO.md`.
