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

## Detalhe: fachada do vídeo (19/11/2026)

Branch `feature/tasks-19-11-2026`. Na produção, depois da `main`, o Lighthouse do detalhe (`#id=figma`) deu 73 com LCP de 4,9 s. O LCP é a miniatura da ferramenta, e o relatório mostrava o player do YouTube (cerca de 1 MB de JS) carregando junto com ela.

| Mudança | Por quê |
|---|---|
| O vídeo virou uma fachada: capa (`i.ytimg.com`) e botão. O iframe `youtube-nocookie` só entra no clique, com `autoplay`, e recebe o foco | Quem não assiste ao vídeo não baixa o player. O ganho é de banda, de boas práticas (o YouTube deixava cookies de terceiros e erros no console) e de privacidade |
| A miniatura do topo ganhou `fetchpriority="high"` e perdeu o `decoding="async"` | Ela é o LCP da página |
| `js/video.js`, com o id, o embed e a capa, e `tests/video.test.js` | A validação do embed saiu do `detalhe.js` e ganhou teste |
| `https://i.ytimg.com` no `img-src` das 3 páginas | Para a capa |

### Medição (Lighthouse 13, móvel, `#id=figma`)

| | Performance | Boas práticas | LCP |
|---|---|---|---|
| Produção, antes (3 rodadas) | 61, 97 e 94 | 96 | 8,6, 2,5 e 3,0 s |
| Local, antes (3 rodadas) | 93, 98 e 92 | 96 | 3,2, 2,5 e 3,4 s |
| Local, depois (4 rodadas) | 93, 92, 93 e 95 | **100** | 3,3, 3,4, 3,2 e 2,9 s |

A nota baixa da produção vem da primeira rodada, com o cache frio. Ali o FCP foi de 5,8 s, antes de qualquer JavaScript, por causa dos 5 CSS e do `tema.js` que bloqueiam a renderização e do GitHub Pages ainda sem cache. Com o cache quente, o detalhe fica entre 94 e 97. A fachada não muda o LCP em rede rápida, mas tira cerca de 1 MB da página e leva boas práticas a 100. O próximo ganho real é juntar os 5 CSS num arquivo só.

