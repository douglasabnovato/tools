# MVP: tools

**Nível:** N3 (produto). Proposta do Claude em 10/11/2026; o autor confirma.
**Resumo:** 8 de 12 aplicáveis atendidos (20/11/2026)
**Finalizado:** não. Falta do código: LCP da página de ferramenta abaixo de 2,5 s com cache frio (#58). Falta do autor: decidir a hipótese (#23, proposta escrita) e a ferramenta de medição (#24, recomendação escrita), ligar os alertas do Dependabot e levar a `developer` para a `main`.

Régua: `engenharia/arquitetura/padroes.md`. "Atende" só com comando, data e resultado.

## Problema e público
O catálogo de ferramentas e hospedagens do dia a dia de quem desenvolve, com para que serve cada uma e quando usar (README).

## Critérios (10/11/2026)

| # | Critério | Situação | Evidência |
|---|---|---|---|
| 1 | Problema e público claros | Atende | O catálogo de ferramentas e hospedagens do dia a dia de quem desenvolve, com para que serve cada uma e quando usar (README). |
| 2 | Hipótese a validar | Não atende | Proposta escrita em 20/11/2026 ([hipoteses.md](https://github.com/douglasabnovato/learntech-content/blob/main/docs/estrategia/hipoteses.md)), no formato da [learntech-content#23](https://github.com/douglasabnovato/learntech-content/issues/23). A aposta é do autor: o critério só atende depois da decisão dele. |
| 3 | Fluxo principal completo | Atende | `npm run e2e` no learntech-content contra a produção em 20/11/2026: fluxos, acessibilidade, capturas, estabilidade e estados passaram. O workflow `e2e` roda na CI do learntech-content a cada push na `main` (sucesso em 19/11/2026) e toda segunda-feira ([learntech-content#10](https://github.com/douglasabnovato/learntech-content/issues/10)). Fluxos deste site: busca encontra uma ferramenta, detalhe. |
| 4 | Escopo enxuto | Atende | Seção "Fora do MVP" abaixo, com as decisões do autor. |
| 5 | Medição de uso | Não atende | Sem painel de visitas. A API registra só as identificações (D1). Recomendação pontuada das ferramentas gratuitas em 20/11/2026 ([medicao.md](https://github.com/douglasabnovato/learntech-content/blob/main/docs/estrategia/medicao.md)): Cloudflare Web Analytics. A escolha e a conta são do autor ([learntech-content#24](https://github.com/douglasabnovato/learntech-content/issues/24)). |
| 6 | Falhas tratadas | Atende | `e2e/estados.spec.mjs` no learntech-content contra a produção em 20/11/2026, 2 rodadas sem falha: home com a API lenta e fora do ar (cópia de reserva), detalhe com "Carregando detalhes..." com a API lenta e "Detalhes indisponíveis" com "Tentar novamente" com a API fora, busca sem resultado com "Nada encontrado"; falha da API coberta por `tests/api.test.js`. |
| 7 | Desempenho aceitável | Parcial | `npm run ux:lighthouse` (móvel) contra a produção em 19/11/2026, depois da `main`: home 97 (LCP 2,0 s, CLS 0); ferramenta 73 com cache frio (LCP 4,9 s) e de 94 a 97 nas rodadas seguintes. A fachada do vídeo, que tira o iframe do YouTube do carregamento, está na `developer` ([#58](https://github.com/douglasabnovato/tools/issues/58)). CLS no celular com rede lenta (`e2e/estabilidade.spec.mjs`, 20/11/2026): 0,001 e 0, e a tools#64 pode fechar. |
| 8 | Acessibilidade básica | Atende | Produção, axe em 20/11/2026 (`npm run e2e`, projeto acessibilidade): 0 violações em home e ferramenta. Lighthouse de acessibilidade de 99 a 100 na produção em 19/11/2026. |
| 9 | Segurança e conformidade | Parcial | `npm audit --omit=dev` em 10/11/2026: 0 vulnerabilidades. Alertas do Dependabot desligados (`gh api .../dependabot/alerts` responde 403 em 10/11/2026; ligar é do autor). Sem segredo no código. CSP por `meta` nas três páginas, na `developer` ([#59](https://github.com/douglasabnovato/tools/issues/59)). |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/tools/rulesets` em 10/11/2026: ruleset "main protegida" ativo (check `verificar` obrigatório, sem force push, sem apagar a `main`). CI em todo push e PR. |
| 11 | Testes dos fluxos críticos | Atende | CI da `developer` em 10/11/2026 (run 42853869995): 14 testes, 14 passando, 0 pulados. |
| 12 | Documentação honesta | Atende | Os comandos `npm run` citados existem; `copias`, `sitemaps` e `validar` são da API (conferido em 10/11/2026). Contagens do README conferidas com a API. |

## Fora do MVP
- Domínio próprio e qualquer serviço pago: o ambiente fica gratuito (decisão do autor, 10/11/2026).
- Identificação opcional: a identificação obrigatória continua ([learntech-content#5](https://github.com/douglasabnovato/learntech-content/issues/5), não autorizada pelo autor em 10/11/2026).
- Votação de temas nos cards de programa ([learntech-content#4](https://github.com/douglasabnovato/learntech-content/issues/4), aguardando o autor).
- Filtro por modelo de cobrança ([#56](https://github.com/douglasabnovato/tools/issues/56)): entregue na `developer` em 12/11/2026 (c976e62). Vale depois do deploy.
- Medição do catálogo ([#57](https://github.com/douglasabnovato/tools/issues/57)): depois do MVP.

## Histórico
- 10/11/2026: primeira tabela, depois do ciclo de acessibilidade e busca nos quatro sites.
