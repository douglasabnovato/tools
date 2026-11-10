# Como evoluir o tools

Guia curto para mudar o site com segurança. Ferramentas e hospedagens **não nascem aqui**: elas entram pela API, em `learntech-content` (veja `../learntech-content/docs/COMO-EVOLUIR.md`, seção 3).

## 1. O que é
- Site estático em JavaScript puro (sem build), publicado no GitHub Pages (`douglasabnovato.github.io/tools`) a partir da `main`.
- Os dados vêm de `/v1/tools/ferramentas.json` e `/v1/tools/hospedagens.json` da API. Sem API, o site usa as cópias geradas em `data/`.

## 2. Onde fica cada coisa
| Arquivo | Papel |
|---|---|
| `index.html`, `main.js` | Catálogo. Espera a API por até 1,5 s; se ela responder depois, os dados são trocados sem perder o filtro |
| `js/renderer.js` | Cards, abas (setas, Home e End), busca e `app.usarDados` |
| `404.html` | Servido pelo GitHub Pages em qualquer rota inexistente. Caminhos absolutos `/tools/...`, porque a URL errada fica na barra |
| `js/tema.js` | Aplica o tema antes de desenhar. Fica em arquivo, e não inline, por causa da CSP |
| `detalhe.html`, `js/detalhe.js` | Página de detalhe (`?id=<slug>`, procura nas duas listas; o formato antigo com `#` continua aceito), com canonical, Open Graph e "Tentar novamente" |
| `js/api.js`, `js/config.js` | Endereço da API e SDK de identificação |
| `js/utils.js` | Utilidades com teste |
| `data/tools.js`, `data/host.js` | **Gerados** pela API (`npm run copias` em `learntech-content`). Não edite à mão; estão no `.prettierignore` |
| `sitemap.xml` | **Gerado** pela API (`npm run sitemaps`), com ferramentas e hospedagens |
| `docs/claudeia/verificar.ps1` | Verificação estática (conta os itens das cópias) |

## 3. Quando chegar uma ferramenta ou hospedagem nova
1. O item entra em `learntech-content/content/tools/ferramentas.json` ou `hospedagens.json`, com `slug`, `detalhe`, fontes de 2 domínios e de 1 a 5 relacionados. As categorias e os preços (`Gratuito`, `Freemium`, `Pago`, `Descontinuado`) seguem os existentes.
2. Lá: `npm run validar`, `npm run copias` e `npm run sitemaps`.
3. Aqui: `npm test && npm run lint && npm run format:check`, depois commit só das cópias e do sitemap.

## 4. Quando mudar o site
- **Categoria nova:** ela aparece sozinha como aba, a partir dos dados. Confira a navegação por teclado.
- **Detalhe:** links novos usam `detalhe.html?id=`, igual ao sitemap e ao canonical.
- **Formatação:** `npm run format:check` é obrigatório na CI.
- **Modal de identificação:** obrigatório hoje. Mudar isso é decisão do autor (issue na API).
- **CSP:** fica num `<meta http-equiv>` igual em `index.html`, `detalhe.html` e `404.html` (`tests/csp.test.js` confere). Nada de `<script>` inline nem `onclick`. Origens liberadas e por quê:
  - API (`learntech-content.douglasabnovato.workers.dev`): dados (`connect-src`), SDK de identificação (`script-src`) e `/media/` (`img-src`).
  - `fonts.googleapis.com` e `fonts.gstatic.com`: Google Fonts. O primeiro também em `connect-src`, para o axe ler o CSS sem erro no console.
  - `www.google.com` e `*.gstatic.com`: favicons das miniaturas (`/s2/favicons` redireciona para `t0..t3.gstatic.com`).
  - `www.youtube-nocookie.com`: player do detalhe (`frame-src`).
  - `style-src 'unsafe-inline'`: o SDK monta o modal com `<style>` no Shadow DOM.
  - Miniatura de domínio novo, Turnstile (`challenges.cloudflare.com`) ou outro recurso externo: acrescente a origem nas 3 páginas antes de publicar, ou ele é bloqueado.

## 5. Comandos
| Comando | Para quê |
|---|---|
| `npx serve .` | Servidor local (o `serve.json` mantém a query do detalhe) |
| `npm test` | `node --test` (14 testes em 10/11/2026) |
| `npm run lint` / `npm run format:check` | ESLint e Prettier (obrigatórios na CI) |
| `powershell -ExecutionPolicy Bypass -File docs/claudeia/verificar.ps1` | Verificação estática |

## 6. Estabilidade: antes de dar por pronto
- [ ] Testes, lint, format:check e `verificar.ps1` verdes.
- [ ] CI verde na branch; feature → `developer` → `main` (`../learntech-content/docs/processo/fluxo-git.md`).
- [ ] "pages build and deployment" verde com o commit da `main`.
- [ ] `npm run e2e` em `learntech-content` sem falha nos testes do tools.

## 7. Documentos
- `Readme.md`: visão geral. `docs/README.md`: engenharia.
- `docs/claudeia/`: histórico datado, com o diagnóstico de MVP e o relatório de 03/11/2026.
- `CLAUDE.md`: instruções para o Claude. Contrato do conteúdo deste site: `../learntech-content/docs/contratos/tools.md`.
- `docs/ESTADO-DO-PROJETO.md`: o que fizemos, como está hoje e o que queremos fazer, com as issues em ordem.
- Próximos passos: issues com a label `proximos-passos`.
