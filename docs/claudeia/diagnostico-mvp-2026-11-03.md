# Diagnóstico MVP: tools (douglasabnovato.github.io/tools)

Data: 03/11/2026. Só leitura: nenhum arquivo do repositório foi alterado.
Base: `Readme.md`, `docs/`, `package.json`, `index.html`, `detalhe.html`, `main.js`, `js/`, `css/`, `tests/`, `sitemap.xml`, `.github/workflows/ci.yml`, `learntech-content/docs/processo/ESTADO.md`, `learntech-content/scripts/gerar-sitemaps.mjs` e o SDK `learntech-content/public/sdk/identificacao.js`.

**Comandos executados**
- `npm test`: 7 de 7 passando.
- `npm run lint`: 0 erros.
- `npm run format:check`: **falha em 5 arquivos** (`js/detalhe.js`, `js/renderer.js`, `js/utils.js`, `tests/api.test.js` e `tests/utils.test.js`).
- `git log`: a branch `feature/tasks-03-11-2026` está sincronizada com a `origin/main` (0 commits à frente).

---

## 1. Produto

### Proposta de valor
"Ferramentas que valeram o tempo": uma seleção de uso real, não um ranking. O critério está em `Readme.md:19-31`. Cada card diz o que a ferramenta faz, a categoria e o modelo de cobrança (Gratuito, Freemium, Pago ou Descontinuado), e o detalhe traz fontes e "Veja também no ecossistema".

### Catálogo real
- **Ferramentas:** 87 em 14 categorias. As maiores são Código (15), Produtividade (12) e Marketing e CRM (9).
- **Hospedagens:** 11.
- **Detalhe:** 100% dos itens têm `detalhe` na API. Têm `relacionados`: 81 de 87 ferramentas e 11 de 11 hospedagens.

### Público
Dev, PM, designer e aluno do ecossistema que precisa resolver uma tarefa (prototipar, testar API, publicar).

### Jornadas

| Jornada | Situação | Evidência |
|---|---|---|
| Buscar | Funciona: nome, descrição, categoria e preço, sem acento, com atalho `/` e `Esc` | `js/renderer.js:80-95` e `:342-350` |
| Filtrar | Funciona: chips por categoria com contagem e `aria-pressed`. **Falta** filtro por preço, mesmo sendo o dado mais útil para decidir | `js/renderer.js:107-129` |
| Compartilhar recorte | Funciona: `?s=&c=&q=` | `js/renderer.js:218-242` |
| Abrir detalhe | Funciona com a API: `detalhe.html#id=`. Se a API demorar mais de 2,5 s, o site fica **para sempre** com a cópia local, sem `slug`, e os cards passam a abrir o site externo | `main.js:8` e `:31`; `js/renderer.js:137-148` |
| Relacionados | Funciona | `js/detalhe.js:117-122` e `:220-221` |
| Voltar mantendo o filtro | Funciona: lê o referrer | `js/detalhe.js:68-79` |
| Primeira visita | **Atrito alto.** O modal de identificação é obrigatório, porque `carregarIdentificacao` não passa `data-obrigatorio="false"` | `js/api.js:85-94`; `identificacao.js:15` |
| Carregamento | **Lacuna.** A grade fica vazia, sem "carregando", por até 2,5 s enquanto espera a API | `main.js:31`; `index.html:137-139` |

### Pronto
Catálogo, filtros, busca, URL compartilhável, lazy load com `IntersectionObserver`, tema, detalhe seguro (`textContent`, `urlSegura`, `youtube-nocookie`), CI e testes. Ícones SVG embutidos, sem CDN de ícones.

### Lacunas para o MVP
1. API tardia descartada.
2. Hospedagens fora do sitemap.
3. SEO e OG do detalhe.
4. Padrão ARIA de abas incompleto.
5. Decisão sobre o modal.
6. Readme desatualizado.
7. Miniaturas pesadas.
8. Medição.

### Métricas propostas
| Métrica | Fonte | Situação |
|---|---|---|
| Acessos por sessão e página | `POST /v1/acessos` (SDK) | Existe; falta painel (issue #14, "analytics") |
| Uso de filtro e busca (categorias e termos mais usados, buscas sem resultado) | `trocarCategoria` e `desenharVazio` em `js/renderer.js:274` e `:171` | Não existe |
| Cliques para o site oficial (do card e do detalhe) | Evento de clique | Não existe |
| Taxa de fallback local | `main.js:25` | Só no console |
| Lighthouse ≥ 90 e páginas indexadas (Search Console) | Ferramentas externas | Não rodado |

---

## 2. Engenharia

### Estrutura
- `main.js` (33 linhas) carrega os dados.
- `js/renderer.js` (376 linhas) é uma closure `createApp` com estado, filtros, URL e eventos, bem organizada.
- `js/detalhe.js` (316 linhas).
- `js/api.js` é duplicado do career.
- `js/utils.js` tem `debounce` e `normalizar`.

### Testes
7 testes de unidade (api, contrato das cópias, `normalizar` e `debounce`).

**Sem teste para:**
- `filtrar` e `contarCategorias` (fechadas dentro de `createApp`);
- `listaValida` (`main.js:11`);
- `urlSegura`, `srcImagem`, `formatarData` e `videoSemCookie` (`js/detalhe.js:27-65`).

Todas são puras e dá para extraí-las para `utils.js`.

### CI
`.github/workflows/ci.yml` roda `verificar.ps1`, `node --check` e `node --test`.

**Falta:**
- lint e formato na CI;
- verificar `detalhe.html`: o `docs/claudeia/verificar.ps1` (94 linhas) confere só `index.html`, os imports, os dados e o manifest;
- conferir o sitemap.

### Acessibilidade
**Bom:**
- skip-link;
- chips com `aria-pressed`;
- `aria-live` no contador (`index.html:137`);
- estado do detalhe com `role="status"` (`detalhe.html:91`);
- `prefers-reduced-motion` (Readme).

**Problemas:**
- As abas têm `role="tab"`, mas sem setas, `Home`/`End` nem `tabindex` móvel (`index.html:71-90`; `js/renderer.js:294-295`). As duas abas apontam `aria-controls` para o mesmo `main`, que tem `role="tabpanel"` (`index.html:124`). O padrão funciona, mas está incompleto.
- O "Carregar mais" redesenha a grade inteira (`js/renderer.js:209` e `:332-335`) e reinicia a animação `grid-enter`. O foco fica no botão, sem anúncio dos itens novos além do contador.
- Atalho `/`: chama `preventDefault` sempre que o foco não está na busca (`js/renderer.js:343`). Hoje não há outro campo, mas o modal do SDK tem inputs de nome e e-mail, e quem digitar "/" ali perde o caractere.

### SEO
**Bom:** `index.html` tem canonical, `og:url`, `og:locale` e Twitter (`index.html:15-25`).

**Problemas:**
- `detalhe.html` tem `og:image` **relativo** (`detalhe.html:21`), inválido para Open Graph. Não tem canonical nem `og:url`.
- `js/detalhe.js:240-241` troca só `document.title` e a description: não mexe em `og:*` e não corta a description em 160 caracteres.
- O `sitemap.xml` tem 88 URLs: a home e as 87 ferramentas. **As 11 hospedagens, todas com `detalhe`, ficam de fora** porque o gerador da API só lê `ferramentas.json` (`learntech-content/scripts/gerar-sitemaps.mjs:51`).
- Os links internos usam `#id=` (`js/renderer.js:139`), e o buscador não segue fragmentos.
- O HTML chega vazio ao buscador (o próprio `Readme.md:230` reconhece).

### Performance
- `assets/` tem cerca de 10 MB: `thumb_tools/` com 8,5 MB e `thumb_host/` com 1,4 MB. São capturas JPG, 6 delas acima de 300 KB (`behance.jpg`, `dribbble.jpg`, `freepik.jpg`, `nicepage.jpg`, `pinterest.jpg` e outra).
- Todos os 52 arquivos têm referência, então a lista de "órfãos" do `Readme.md:242-244` está obsoleta.
- 41 de 87 miniaturas vêm de `https://www.google.com/s2/favicons` (terceiro, com redirecionamento para `gstatic`). Isso contradiz o "Apenas Google Fonts" de `Readme.md:43`.
- `assets/logos/logo-tools.png` tem 214 KB para exibir em 30×30 (`index.html:67`).
- O bloqueio de até 2,5 s antes do primeiro render (`main.js:8`) piora o LCP.

### Segurança (CSP)
**Bom:**
- `textContent` nos chips (`js/renderer.js:123-127`);
- `href` só `http(s)` (`:146`);
- detalhe com `urlSegura` e `srcImagem`.

**Lacunas:**
- Não há CSP; no GitHub Pages ela só pode vir por `<meta>`.
- `desenharVazio` usa `innerHTML` com texto fixo (`:174-177`). É seguro, mas convém trocar por nós.

**Política sugerida** (o SDK pede Turnstile e `<style>` inline):
```
default-src 'self'; script-src 'self' 'sha256-<hash do script de tema>' https://learntech-content.douglasabnovato.workers.dev https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com;
img-src 'self' data: https://learntech-content.douglasabnovato.workers.dev https://www.google.com https://*.gstatic.com;
connect-src https://learntech-content.douglasabnovato.workers.dev; frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com;
base-uri 'self'; form-action 'self'; object-src 'none'
```

### Dívidas e riscos
- **`Readme.md` desatualizado:**
  - cita "45 ferramentas · 10 hospedagens · 12 categorias" (`:5`, `:39`, `:133-134`, `:211`, `:269-290`), quando são 87, 11 e 14;
  - manda **editar `data/tools.js` à mão** (`:61-82`), o que contradiz `docs/README.md:15` ("geradas pelo `npm run copias` da API, não edite à mão");
  - "Em aberto" lista canonical e `og:url` como pendentes (`:255`), mas já estão no `index.html`;
  - a tabela de branches está obsoleta (`:294-304`).
- **`docs/README.md:25`** lista "testes com `node --test`" como pendência, mas eles já existem.
- **API tardia descartada:** `main.js:31` usa `esperarAte` e, se a resposta chegar depois, ela é jogada fora (o career aplica a resposta tardia em `career/main.js:14-19`).
- **Detalhe sem "Tentar novamente":** quando a API está fora, o detalhe não oferece nova tentativa (o career oferece). A mensagem "Ferramenta não encontrada" aparece também para hospedagem (`js/detalhe.js:289-290` e `:304-305`).
- **Sem 404:** não há `404.html`.
- **Item descontinuado:** 1 item com `pricing: "Descontinuado"` continua no catálogo. Decidir a política (ocultar por padrão ou mostrar no fim).
- **Issues de conteúdo e estudo misturadas:** as 18 issues abertas são de estudo, growth e marketing ([GROWTH], playlists, fotografia), sem labels. Nenhuma é de engenharia ou de produto do site.

---

## 3. Conteúdo (até 5 ideias de alto valor)

Slugs conferidos contra `learntech-content/content/tools/*.json`: nenhum existe.

1. **`tools/hospedagens/render`:** usado nos programas 104 e 201 do learn-tech (`content/learn-tech/programas/104.json` e `201.json`) e ainda ausente do catálogo. Pontos a citar:
   - no plano gratuito, o web service dorme após cerca de 15 min sem tráfego;
   - 750 horas de instância por mês;
   - Postgres grátis com expiração.

   As fontes são blogs de terceiros e divergem sobre a expiração do banco, então é preciso conferir na documentação oficial ([temps.sh](https://temps.sh/blog/render-pricing-2026), [livemy.app](https://livemy.app/blog/render-pricing)).
2. **`tools/ferramentas/supabase`:** citado no evento `bootcamps/eventos/byteclass-dev.json`. É um back-end como serviço (Postgres, auth e storage) com plano gratuito e fecha a categoria Back-end (hoje com 5). Liga com `prisma` e `vercel`.
3. **`tools/ferramentas/google-search-console`:** já citado no texto de outra ficha, mas sem ficha própria. É a ferramenta de que os próprios sites precisam para enviar os sitemaps (página de projeto no GitHub Pages não tem `robots.txt`). Liga com `google-analytics` e `pagespeed-insights`.
4. **`tools/ferramentas/qulture-rocks`:** pedido na issue #23. Plataforma brasileira de gestão de desempenho com avaliações, feedback 360°, OKRs, 1:1 e PDI ([Vendr](https://www.vendr.com/marketplace/qulture-rocks), [B2B Stack](https://www.b2bstack.com.br/product/qulturerocks)). Abre o recorte "gestão de pessoas" para PMs e líderes. Confirmar preço no site oficial.
5. **`tools/ferramentas/github-actions`:** é citado em outras fichas, mas não tem ficha própria, e é a base da CI e do monitor de disponibilidade dos cinco projetos. Liga com `github`, `github-pages` e o artigo de CI do learn-tech, se houver.

---

## 4. Plano de ação executável hoje (em ordem de prioridade)

### T1. Formatação verde e lint e formato na CI
- **Objetivo:** `format:check` passar e a CI barrar regressões.
- **Arquivos:**
  - `npx prettier --write "js/**/*.js" "tests/**/*.js"`, que afeta 5 arquivos; as cópias em `data/` não entram no glob;
  - `.github/workflows/ci.yml`: passos `npm ci`, `npm run lint` e `npm run format:check`.
- **Pronto quando:** `npm run format:check` sai com 0 e o job `verificar` fica verde.
- **Risco:** baixo. Commit só de formato.

### T2. Aplicar a API mesmo quando ela chega tarde, com estado de carregamento
- **Objetivo:** não perder o detalhe por lentidão e não deixar a tela vazia.
- **Arquivos:**
  - `main.js`: renderizar já com a cópia local e, quando a API responder, aplicar os dados novos mantendo seção, filtro, busca e paginação;
  - `js/renderer.js`: expor `app.usarDados({toolsList, hostsList})` que chama `montarFiltros()` e `renderizar()`; `createApp` devolve esse objeto;
  - `index.html:137`: contador inicial "Carregando catálogo...".
- **Pronto quando:**
  - com a API bloqueada no DevTools, o catálogo aparece em menos de 300 ms;
  - com a API atrasada 4 s (throttling), os cards passam a apontar para `detalhe.html` sem recarregar e sem perder o filtro da URL;
  - há teste de `listaValida` extraída para `utils.js`.
- **Risco:** médio. A troca de dados não pode resetar o `estado` nem duplicar ouvintes (`ligarEventos` só uma vez).

### T3. Open Graph e canonical do detalhe
- **Objetivo:** detalhe compartilhável e canônico.
- **Arquivos:**
  - `detalhe.html:21`: `og:image` absoluto (`https://douglasabnovato.github.io/tools/public/og-image.png`), mais `<link rel="canonical">`, `og:url` e `og:locale`;
  - `js/detalhe.js:240-241`: preencher canonical e `og:url` com `.../detalhe.html?id=<slug>`, atualizar `og:title` e `og:description` e cortar a description em 160 caracteres;
  - `js/renderer.js:139`: link com `?id=` e `serve.json` com `{"cleanUrls": false}`.
- **Pronto quando:** em `npx serve .`, o card abre `detalhe.html?id=figma`; `link[rel=canonical]` é igual à URL do sitemap; `og:image` começa com `https://`.
- **Risco:** baixo. `detalhe.js:288` já aceita `?id=` e `#id=`.

### T4. Padrão ARIA de abas e melhorias no detalhe
- **Objetivo:** abas operáveis por teclado e estados de erro úteis.
- **Arquivos:**
  - `js/renderer.js`, em `ligarEventos` e `aplicarSecao` (`:245-256`, `:294-295`): setas `←`/`→`, `Home` e `End`, e `tabindex="0"` na aba ativa com `-1` na outra;
  - o atalho `/` (`:343`) passa a ignorar quando `document.activeElement` é `input`, `textarea` ou `contenteditable`;
  - `js/detalhe.js`: botão "Tentar novamente" no estado "indisponível" e texto "Item não encontrado".
- **Pronto quando:**
  - só com teclado: `Tab` chega à aba e `→` troca para Hospedagens, com a URL `?s=host`;
  - no modal do SDK, digitar "/" funciona;
  - com a API bloqueada, o detalhe mostra o botão e ele refaz a busca.
- **Risco:** baixo.

### T5. Documentação em dia
- **Objetivo:** Readme fiel ao código.
- **Arquivos:**
  - `Readme.md`: números (87/11/14) e tabelas de categoria;
  - trocar "Como adicionar um item" (`:61-82`) por "edite em `learntech-content/content/tools/` e rode `npm run copias`";
  - "Externo" (`:43`) passa a citar a API, os favicons do Google e o Turnstile;
  - remover a lista de órfãos (`:242-244`) e as branches obsoletas;
  - `docs/README.md:25`: testes já existem.
- **Pronto quando:** `grep -n "45 ferramentas\|Adicione um objeto" Readme.md` não devolve nada.
- **Risco:** nenhum.

### T6. CSP por meta, 404 e `verificar.ps1` cobrindo o detalhe
- **Objetivo:** primeira camada de segurança e verificação mais ampla.
- **Arquivos:**
  - `index.html` e `detalhe.html`: `<meta http-equiv="Content-Security-Policy">` com a política da seção 2;
  - criar `404.html` no padrão do `detalhe.html`;
  - `docs/claudeia/verificar.ps1`, etapa 1: varrer também `detalhe.html` e `404.html`, e checar se o `sitemap.xml` é XML válido com `<loc>` começando com `https://douglasabnovato.github.io/tools/`.
- **Pronto quando:**
  - console sem violação de CSP no catálogo, no detalhe com vídeo e no modal do SDK;
  - `verificar.ps1` falha se um `src` local do `detalhe.html` não existir (testar renomeando um arquivo);
  - a CI fica verde.
- **Risco:** médio no CSP: origens do Turnstile e redirecionamento dos favicons para `t*.gstatic.com`. Testar o fluxo completo.

---

## 5. Issues de próximos passos

Labels existentes: `bug`, `documentation`, `enhancement`, `good first issue`. Labels a criar: `mvp`, `seo`, `a11y`, `performance`, `seguranca`, `conteudo`, `produto`.

### I1. Hospedagens no sitemap
Correção no gerador, na API.
- **Contexto:** as 11 hospedagens têm `detalhe`, mas o `sitemap.xml` só lista ferramentas, porque `learntech-content/scripts/gerar-sitemaps.mjs:51` lê apenas `tools/ferramentas.json`. Cerca de 11% do catálogo fica invisível para o buscador.
- **Critérios de entrega:**
  - o gerador inclui `tools/hospedagens.json`;
  - `tools/sitemap.xml` passa a ter 99 URLs;
  - teste no repositório da API que compara a contagem do sitemap com os itens que têm `detalhe`.
- **Labels:** `bug`, `seo`, `mvp`.

### I2. Miniaturas leves: WebP e tamanho padrão
- **Contexto:** `assets/thumb_*` soma cerca de 10 MB de JPG, com 6 arquivos acima de 300 KB, e 41 miniaturas dependem do serviço de favicons do Google. A decisão "captura de tela ou logo" está pendente desde a versão 3 (`Readme.md:228-231`, `:248`).
- **Critérios de entrega:**
  - decisão registrada;
  - miniaturas em WebP com no máximo 40 KB cada, servidas pela API (`/media/`) e com os caminhos atualizados no conteúdo da API, não à mão;
  - `du -sh assets` abaixo de 2 MB;
  - Lighthouse Performance ≥ 90 na home.
- **Labels:** `performance`, `mvp`.

### I3. Filtro por modelo de cobrança
- **Contexto:** "Gratuito, Freemium ou Pago" é o critério de decisão mais citado, mas só entra pela busca de texto (`js/renderer.js:92`). O item "Descontinuado" aparece misturado aos ativos.
- **Critérios de entrega:**
  - chips de preço combináveis com a categoria;
  - estado na URL (`?p=Gratuito`);
  - itens "Descontinuado" ocultos por padrão, com opção de mostrar;
  - teste da função de filtro extraída.
- **Labels:** `enhancement`, `produto`.

### I4. Decidir o modal de identificação no catálogo
- **Contexto:** `js/api.js:85-94` carrega o SDK obrigatório, que bloqueia a rolagem (`identificacao.js:141-142`) antes de a pessoa ver uma única ferramenta. Isso afeta conversão, e2e e Lighthouse.
- **Critérios de entrega:**
  - decisão do autor registrada em `docs/`;
  - se opcional, `data-obrigatorio="false"` aplicado e o "Agora não" visível;
  - evento de abandono medido.
- **Labels:** `produto`, `mvp`.

### I5. Medição do catálogo: filtros, buscas e cliques
- **Contexto:** a issue #14 pede analytics, mas o site não registra nenhum evento de uso. Sem isso não dá para saber quais categorias, buscas e ferramentas importam.
- **Critérios de entrega:**
  - eventos `filtro`, `busca_sem_resultado` e `clique_site_oficial` enviados por `POST /v1/acessos` ou por um endpoint novo, sem dado pessoal;
  - painel ou consulta documentada;
  - política de privacidade atualizada.
- **Labels:** `enhancement`, `produto`.

### I6. Lighthouse, e2e e acessibilidade com relatório
- **Contexto:** o ESTADO lista e2e e Lighthouse como pendentes para "estável e público". As abas não seguem o padrão ARIA completo e o "Carregar mais" redesenha a grade inteira.
- **Critérios de entrega:**
  - relatório Lighthouse da home e de 1 detalhe em `docs/claudeia/`, com Performance, Acessibilidade e SEO ≥ 90;
  - e2e cobrindo aba, chip, busca, `?s=&c=&q=`, detalhe e voltar;
  - axe sem erros sérios;
  - o "Carregar mais" anexa só os cards novos.
- **Labels:** `a11y`, `performance`, `mvp`.

---

## 6. Melhorias do processo

1. **Separar backlog de produto e de estudo.** As 18 issues abertas são de growth e estudo, sem label. Criar templates de bug, feature e conteúdo (sugestão de ferramenta com "em que situação ela te salvou", critério do `Readme.md:363-366`). Mover o [GROWTH] para um projeto próprio.
2. **Gerador como fonte única também do sitemap,** com teste de cobertura (I1). Hoje um tipo novo de conteúdo pode ficar fora do sitemap sem nenhum aviso.
3. **CI completa nos sites estáticos:**
   - `npm ci`, lint e formato;
   - `verificar.ps1` cobrindo todas as páginas HTML;
   - checagem de que `data/*.js` bate com a API (o `npm run copias` em modo de verificação falha se houver diff).
4. **Cliente da API compartilhado:** `api.js` duplicado com o career. Distribuir um único `cliente.js` versionado pela API.
5. **Readme gerado em parte:** contagens e tabelas de categoria (`Readme.md:5`, `:265-290`) geradas pelo `exportar-copias`, para não envelhecer a cada leva de conteúdo (hoje diz 45 e são 87).
6. **Definition of Done de MVP** comum aos dois sites em `docs/processo/checklists.md`: Lighthouse ≥ 90, 0 violações de CSP, sitemap completo, Readme sem número fixo desatualizado e eventos de uso medidos.

**Fontes das buscas na web:** [temps.sh, preços do Render 2026](https://temps.sh/blog/render-pricing-2026), [livemy.app, preços do Render](https://livemy.app/blog/render-pricing), [DEV Community, Render free tier](https://dev.to/build996/render-free-hosting-review-2026-deploy-web-apps-databases-and-cron-jobs-for-free-b39), [Vendr, Qulture.Rocks](https://www.vendr.com/marketplace/qulture-rocks), [B2B Stack, Qulture.Rocks](https://www.b2bstack.com.br/product/qulturerocks).
