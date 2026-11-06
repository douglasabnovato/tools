# tools: documentação de engenharia

Catálogo de ferramentas e hospedagens, com páginas de detalhe. Publicado no GitHub Pages (`https://douglasabnovato.github.io/tools`).

## Stack
- HTML, CSS e JavaScript em módulos ES, sem build e sem dependências npm em produção (`package.json` só tem eslint e prettier).
- **Páginas:** `index.html` (catálogo) e `detalhe.html` (`?id=<slug>`; o formato antigo com `#` também é aceito).

## Como rodar do zero
Sirva a pasta com um servidor estático (`npx serve .`, que lê o `serve.json`, ou Live Server) e abra `index.html`.

## De onde vêm os dados
- **Endereço da API:** `js/config.js` (`API_URL`).
- **Busca:** `main.js` busca `tools/ferramentas.json` e `tools/hospedagens.json`; espera até 1,5 s, cai na cópia local se a API falhar ou demorar e aplica a resposta tardia quando ela chega (`app.usarDados`).
- **Cópias de reserva**, geradas pelo `npm run copias` da API (não edite à mão): `data/tools.js` e `data/host.js`.
- **Telas:**
  - `js/renderer.js` monta os cards (tag de preço, inclusive "Descontinuado");
  - `js/detalhe.js` monta a página de detalhe com "Veja também no ecossistema".

## Qualidade e deploy
- **Deploy:** push na `main` publica no GitHub Pages.
- **CI:** `.github/workflows/ci.yml` roda `npm ci`, `npm run lint`, `npm run format:check`, `docs/claudeia/verificar.ps1` (verificação estática), `node --check` nos módulos e `npm test`, em todas as branches.
- **Sitemap:** `sitemap.xml` é gerado pela API (`learntech-content/scripts/gerar-sitemaps.mjs`); não edite aqui.

## Pendências de engenharia
O backlog fica em `learntech-content/docs/engenharia/backlog.md`. Para este site: hospedagens no sitemap (no gerador da API), CSP, `404.html`, Lighthouse e e2e. O registro do MVP de 03/11/2026 está em `docs/claudeia/06-mvp-2026-11-03.md`.
