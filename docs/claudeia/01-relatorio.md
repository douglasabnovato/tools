# 01 · Relatório de revisão — tools

Revisão independente · 27/10/2026 · branch `feature/claudeia-2026-10-27`
Legenda: **inferido · confirmar** = deduzido do README/código, precisa de confirmação do dono.

## 1. Visão geral

| Item | Situação (evidência) |
| --- | --- |
| Produto | Catálogo curado de ferramentas e hospedagens para quem desenvolve e gerencia produto (Readme.md:17-31) |
| Ecossistema | learnTECH; links para learn-tech e repositório no rodapé (index.html:180-185) |
| Stack | HTML5 + CSS3 + JavaScript ES modules, sem framework, sem build, sem `package.json` |
| Hospedagem | GitHub Pages (`.nojekyll` na raiz); URL informada: https://douglasabnovato.github.io/tools/ — **não consegui abrir a versão publicada daqui** (rede bloqueada), então ela não foi verificada |
| Dependências | 0 de pacote. Externas em tempo de execução: Google Fonts (index.html:33), favicons do Google em 4 miniaturas, API `learntech-content` + script de identificação (js/api.js), hoje **desligados** porque `js/config.js:3` ainda tem o placeholder `SEU-SUBDOMINIO` (js/api.js:5) |
| Dados | `data/tools.js`: 45 itens, 12 categorias; `data/host.js`: 10 itens, 3 categorias (contagem medida; bate com o Readme) |
| Situação | Versão 3 funcional; README detalhado; sem testes e sem CI antes desta revisão |

### Tamanho medido (exclui `.git`)

| Tipo | Arquivos | Linhas | Bytes |
| --- | ---: | ---: | ---: |
| .js | 7 | 975 | 32.551 |
| .css | 4 | 817 | 14.746 |
| .html | 1 | 202 | 8.606 |
| .md | 1 | 346 | 12.226 |
| .webmanifest | 1 | 23 | 565 |
| .jpg | 63 | — | 12.275.906 (~11,7 MB) |
| .png | 8 | — | 2.047.808 (~2,0 MB) |
| .ico | 1 | — | 15.406 |

Detalhe das imagens: `assets/thumb_tools/` 8,73 MB (41 arq.), `assets/thumb_host/` 1,41 MB (9 arq.), `assets/logos/` 1,72 MB, `.github/` (capturas do README) 1,70 MB. Miniaturas medem ~1.650×925 px (ex.: figma.jpg 1662×922) para um espaço de 320×200 no card (index.html:144). Todos os arquivos de texto usam CRLF.

## 2. Objetivo — nota 8/10

| | |
| --- | --- |
| Objetivo (inferido · confirmar) | Responder rápido "qual ferramenta uso para X", com o que faz, categoria e cobrança; curadoria por uso real, não ranking (Readme.md:21-31) |
| Regras de negócio (inferido · confirmar) | (1) entra só ferramenta de uso real; (2) `pricing` ∈ Gratuito/Freemium/Pago; (3) card abre em nova aba; (4) **o ecossistema identifica o visitante (nome e e-mail, sem login)** via `sdk/identificacao.js` quando a API estiver configurada (js/api.js:31-41) — tratado como regra de negócio de medição, não como atrito; (5) a API é a fonte preferida e os dados locais são reserva (main.js) |
| Pontos fortes | Proposta clara e declarada no README e na própria página (index.html:136-140); critério de entrada explícito |
| Falhas | README não menciona a API nem a identificação: diz "Externo: apenas Google Fonts" (Readme.md:43) e a estrutura de pastas omite `js/api.js` e `js/config.js` (Readme.md:113-115) |

## 3. Eficiência de produto digital — nota 7/10

| Aspecto | Evidência |
| --- | --- |
| Fluxo principal | Abrir → filtrar/buscar → clicar no card → site da ferramenta em nova aba. Curto, sem cadastro hoje |
| Atrito | Baixo. O gate de identificação existe no código mas está inativo (config com placeholder) — ver decisão de produto P-01 |
| Conteúdo desatualizado | Readme desatualizado na arquitetura (acima). Título da aba muda de "Tools \| learnTECH" (index.html:6) para "Ferramentas \| learnTECH Tools" ao carregar (js/renderer.js:241) |
| Links | 55 `site_url`, todos `https://`, sem duplicados (medido). **Não verifiquei se respondem** (sem rede). 4 miniaturas dependem de `google.com/s2/favicons` |
| Coerência | Contagens do Readme batem com os dados; categorias derivadas dos dados |
| Dados da API | Se a API demorar mais de 2,5 s (main.js:8) o site usa os dados locais e descarta a resposta da API — o visitante nunca vê a versão da API naquela visita |

## 4. Performance de software — nota 5/10

| Aspecto | Evidência |
| --- | --- |
| Peso de imagens | Miniaturas ~5× maiores em cada eixo que o espaço exibido; média ~210 KB por miniatura; 7 arquivos acima de 300 KB (pinterest.jpg 490 KB) |
| Mitigação existente | Lazy loading com `IntersectionObserver` (js/renderer.js:58-79) e só 12 cards iniciais (js/renderer.js:8). Estimativa: primeira tela carrega ~12 miniaturas ≈ 2,5 MB (estimativa pela média) |
| Logo | `logo-tools.png` 500×500, 214 KB, exibido a 30×30 (index.html:64, 165) |
| Órfãos | `assets/logos/logo-tools-1.png` (1,5 MB) e `assets/thumbs/tool-1.jpg` (433 KB) não referenciados — não são baixados pelo visitante, só pesam no repositório |
| JS/CSS | ~47 KB de texto, sem minificação; irrelevante frente às imagens |
| Externo | Google Fonts bloqueia renderização (CSS no `<head>`), com `preconnect` e `display=swap` |
| Cache | Controlado pelo GitHub Pages (sem configuração possível no repositório) |

## 5. UX design — nota 7,5/10

| Aspecto | Evidência |
| --- | --- |
| Hierarquia / primeira impressão | Eyebrow + h1 + subtítulo + filtros com contagem + grade; card informa nome, função, categoria e cobrança |
| Navegação | Duas abas (Ferramentas/Hospedagens), estado na URL (`?s=&c=&q=`), "Carregar mais" de 12 em 12 |
| Busca/filtros | Busca sem acento (js/utils.js), atalho `/` e `Esc`, chip desmarca ao clicar de novo, estado vazio com "Limpar filtros" |
| Acessibilidade | Skip link, `:focus-visible` global (css/layout.css:89), `aria-live` no contador, `aria-pressed` nos chips, `prefers-reduced-motion` (css/layout.css:302). Falhas: abas com `role="tablist"` sem navegação por setas; campo de busca remove o outline (css/header.css:116) e conta só com a cor da borda |
| Responsivo | Breakpoints 860/720/420 px (css/header.css:192, 220; css/layout.css:284) |
| Temas | Claro/escuro, segue o sistema na 1ª visita, salva em `localStorage` com try/catch (index.html:44-56; js/renderer.js definirTema) |
| Sem JS | Catálogo vazio: tudo é montado por JavaScript (já listado no Readme como pendência) |

## 6. Engenharia — nota 6/10 (antes do lote 1)

| Aspecto | Evidência |
| --- | --- |
| Arquitetura | Separação clara: dados (`data/`), cliente da API (`js/api.js`), app (`js/renderer.js`), utilidades; card via `<template>` |
| Testes | Nenhum |
| CI | Nenhum (`.github/` só tinha imagens) — **criado no lote 1** |
| Robustez | `localStorage` já protegido; fallback local quando a API falha. Faltava validar o formato da resposta da API — **corrigido no lote 1** |
| Segurança | Chips montados com `innerHTML` a partir de `category` (que pode vir da API) e `href` aceito sem checar protocolo — **corrigido no lote 1**. Script de identificação é carregado do domínio da API sem SRI (aceitável para script próprio; registrar como risco) |
| Documentação | README rico, porém desatualizado na parte de API |
| Compatibilidade | `main.js` usa top-level await: exige navegadores de 2021+ (Safari 15+) |

## 7. Falhas por gravidade

### Engenharia

| # | Falha | Gravidade | Situação |
| --- | --- | --- | --- |
| E1 | Miniaturas ~10 MB em resolução 5× maior que a exibida | Alta | Proposta (lote 2) |
| E2 | Dados da API entravam no DOM sem validação (`innerHTML` em categoria, `href` sem checar protocolo, lista sem checar formato) | Média (latente: API desligada hoje) | **Executado** |
| E3 | Sem testes nem CI | Média | **Executado** (verificar.ps1 + ci.yml) |
| E4 | README desatualizado sobre API/identificação e arquivos `js/` | Média | Proposta (texto do README é conteúdo do dono) |
| E5 | Logo 214 KB exibido a 30 px | Baixa | Proposta |
| E6 | Abas sem navegação por setas; busca sem outline | Baixa | Proposta (muda comportamento/visual) |
| E7 | `og:image` relativo (index.html:21) — muitos robôs de compartilhamento exigem URL absoluta | Baixa | Proposta (depende da URL de produção) |
| E8 | Arquivos órfãos (1,9 MB) | Baixa | Proposta (proibido apagar nesta revisão) |

### Decisão de produto (não executar sem aprovação)

| # | Tema | Pergunta |
| --- | --- | --- |
| P-01 | Identificação do visitante | A API e o script de identificação devem estar ativos em produção? Hoje `js/config.js` tem placeholder, então a medição de acesso **não acontece**. Aperfeiçoamento sugerido: configurar a URL e registrar no README o motivo da identificação |
| P-02 | Resposta lenta da API | Manter o corte de 2,5 s descartando a API, ou trocar os dados quando ela chegar depois? |
| P-03 | Título da aba | Unificar "Tools \| learnTECH" e "Ferramentas \| learnTECH Tools" |
| P-04 | Miniaturas | Captura de tela vs. favicon (já listado no Readme) |
| P-05 | Indexação | Pré-renderizar o catálogo no HTML para buscadores |
