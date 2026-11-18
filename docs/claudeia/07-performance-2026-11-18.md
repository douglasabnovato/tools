# Performance do carregamento: LCP do modal de identificação (18/11/2026)

Branch `feature/tasks-18-11-2026`, ligada à issue #58. A medição foi feita no site servido localmente (`vite preview` da pasta), com dados e SDK da API de produção, usando Lighthouse 12 no perfil móvel padrão. Rodei a página antes e depois da mudança, com o código antigo guardado por `git stash`.

## O que mudou

| Mudança | Por quê |
|---|---|
| O CSS do Google Fonts entra com `media="print"` e `data-assincrono`, e o `js/estilos-assincronos.js` troca para `media="all"` quando ele chega. Há um `<noscript>` de reserva | Esse CSS bloqueava a renderização por cerca de 950 ms. A CSP não aceita `onload` inline, por isso a troca fica num arquivo |
| O SDK de identificação passou a estar direto no HTML (`<script id="learntech-sdk" defer>`) | O modal é o LCP da primeira visita. Antes, o SDK só era injetado depois do `main.js` e dos módulos dele. O `carregarIdentificacao()` vê o `id` e não injeta de novo |

Páginas tocadas: `index.html`, `detalhe.html` e `404.html` (nesta, só o CSS assíncrono).

## Medição (home, móvel)

| | Performance | LCP | FCP | CLS |
|---|---|---|---|---|
| Antes (2 rodadas) | 84 e 91 | 3,7 e 3,4 s | 2,9 e 1,5 s | 0,006 e 0,008 |
| Depois (3 rodadas) | 100, 100 e 100 | 1,6 s nas três | 1,1 s | 0,017 |
| Detalhe depois (`?id=github-copilot`) | 92 | 3,3 s | 1,2 s | 0 |

A home bateu a meta de LCP ≤ 2,5 s. No detalhe, o LCP é o resumo da ferramenta, que depende do `fetch` da API; essa melhoria fica para uma próxima rodada.
