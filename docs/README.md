# tools: documentação de engenharia

Catálogo de ferramentas e hospedagens, com páginas de detalhe. Publicado no GitHub Pages (`https://douglasabnovato.github.io/tools`).

## Stack
- HTML, CSS e JavaScript em módulos ES, sem build e sem dependências npm.
- **Páginas:** `index.html` (catálogo) e `detalhe.html` (`#id=<slug>`).

## Como rodar do zero
Sirva a pasta com um servidor estático (`npx serve .` ou Live Server) e abra `index.html`.

## De onde vêm os dados
- **Endereço da API:** `js/config.js` (`API_URL`).
- **Busca:** `js/api.js` busca `tools/ferramentas.json` e `tools/hospedagens.json` e cai na cópia local se a API falhar.
- **Cópias de reserva**, geradas pelo `npm run copias` da API (não edite à mão): `data/tools.js` e `data/host.js`.
- **Telas:**
  - `js/renderer.js` monta os cards (tag de preço, inclusive "Descontinuado");
  - `js/detalhe.js` monta a página de detalhe com "Veja também no ecossistema".

## Qualidade e deploy
- **Deploy:** push na `main` publica no GitHub Pages.
- **CI:** `.github/workflows/ci.yml` roda `docs/claudeia/verificar.ps1` (verificação estática) e confere a sintaxe dos módulos com `node --check`, em todas as branches.

## Pendências de engenharia
O backlog fica em `learntech-content/docs/engenharia/backlog.md`. Para este site: testes com `node --test`, acessibilidade, sitemap e Lighthouse.
