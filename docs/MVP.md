# MVP: tools

**Nível:** N3 (produto). Proposta do Claude em 10/11/2026; o autor confirma.
**Resumo:** 5 de 12 aplicáveis atendidos
**Finalizado:** não. Falta do código: fluxo na CI, falhas com teste, desempenho no celular, axe e segurança confirmados na produção. Falta do autor: hipótese (#23) e medição de uso (#24), alertas do Dependabot e levar as integrações para a `main`.

Régua: `engenharia/arquitetura/padroes.md`. "Atende" só com comando, data e resultado.

## Problema e público
O catálogo de ferramentas e hospedagens do dia a dia de quem desenvolve, com para que serve cada uma e quando usar (README).

## Critérios (10/11/2026)

| # | Critério | Situação | Evidência |
|---|---|---|---|
| 1 | Problema e público claros | Atende | O catálogo de ferramentas e hospedagens do dia a dia de quem desenvolve, com para que serve cada uma e quando usar (README). |
| 2 | Hipótese a validar | Não atende | Nenhuma hipótese escrita. A aposta é do autor: [learntech-content#23](https://github.com/douglasabnovato/learntech-content/issues/23). |
| 3 | Fluxo principal completo | Parcial | `npm run e2e` no learntech-content, contra a produção, em 10/11/2026: 2 de 2 fluxos (busca encontra uma ferramenta, detalhe). Fora da CI ([learntech-content#10](https://github.com/douglasabnovato/learntech-content/issues/10)). |
| 4 | Escopo enxuto | Atende | Seção "Fora do MVP" abaixo, com as decisões do autor. |
| 5 | Medição de uso | Não atende | Sem painel de visitas. A API registra só as identificações (D1). Ferramenta gratuita a escolher: [learntech-content#24](https://github.com/douglasabnovato/learntech-content/issues/24). |
| 6 | Falhas tratadas | Parcial | `tests/api.test.js` cobre a falha da API com a cópia de reserva; "Tentar novamente" no detalhe. Vazio e carregamento sem teste próprio. |
| 7 | Desempenho aceitável | Não atende | `npm run ux:lighthouse` (móvel) contra a produção em 10/11/2026, 3 execuções. Home: 5,2 / 3,8 / 4,7 s, mediana 4,7 s, TBT 194 ms, CLS 0,26; ferramenta: 5,9 / 4,7 / 5,6 s, mediana 5,6 s, TBT 75 ms, CLS 0,22. Na home, o elemento do LCP é o texto da janela de identificação. Medido antes das miniaturas em WebP. Meta: 2,5 s ([#58](https://github.com/douglasabnovato/tools/issues/58)). |
| 8 | Acessibilidade básica | Parcial | Produção, axe em 10/11/2026: `color-contrast` 25 e `label-content-name-mismatch` 12 na home. Na `developer`, axe local sem violações em 8 páginas, claro e escuro ([#60](https://github.com/douglasabnovato/tools/issues/60)). Falta confirmar na produção. |
| 9 | Segurança e conformidade | Parcial | `npm audit --omit=dev` em 10/11/2026: 0 vulnerabilidades. Alertas do Dependabot desligados (`gh api .../dependabot/alerts` responde 403 em 10/11/2026; ligar é do autor). Sem segredo no código. CSP por `meta` nas três páginas, na `developer` ([#59](https://github.com/douglasabnovato/tools/issues/59)). |
| 10 | Entrega confiável | Atende | `gh api repos/douglasabnovato/tools/rulesets` em 10/11/2026: ruleset "main protegida" ativo (check `verificar` obrigatório, sem force push, sem apagar a `main`). CI em todo push e PR. |
| 11 | Testes dos fluxos críticos | Atende | CI da `developer` em 10/11/2026 (run 42853869995): 14 testes, 14 passando, 0 pulados. |
| 12 | Documentação honesta | Atende | Os comandos `npm run` citados existem; `copias`, `sitemaps` e `validar` são da API (conferido em 10/11/2026). Contagens do README conferidas com a API. |

## Fora do MVP
- Domínio próprio e qualquer serviço pago: o ambiente fica gratuito (decisão do autor, 10/11/2026).
- Identificação opcional: a identificação obrigatória continua ([learntech-content#5](https://github.com/douglasabnovato/learntech-content/issues/5), não autorizada pelo autor em 10/11/2026).
- Votação de temas nos cards de programa ([learntech-content#4](https://github.com/douglasabnovato/learntech-content/issues/4), aguardando o autor).
- Filtro por modelo de cobrança ([#56](https://github.com/douglasabnovato/tools/issues/56)) e medição do catálogo ([#57](https://github.com/douglasabnovato/tools/issues/57)): depois do MVP.

## Histórico
- 10/11/2026: primeira tabela, depois do ciclo de acessibilidade e busca nos quatro sites.
