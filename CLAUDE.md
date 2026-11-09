# CLAUDE.md: tools

Site estático em JavaScript puro, sem build, no GitHub Pages (`douglasabnovato.github.io/tools`). Ferramentas e hospedagens de uso real. Os dados vêm da API `learntech-content`, a pasta irmã deste repositório. Tudo em português do Brasil.

## Antes de qualquer tarefa
1. `docs/ESTADO-DO-PROJETO.md`: o que foi feito e as issues em ordem.
2. `docs/COMO-EVOLUIR.md`: estrutura do site, arquivos gerados e checklist de estabilidade.
3. Para conteúdo novo: `../learntech-content/docs/contratos/tools.md` (o contrato deste site) e `../learntech-content/docs/processo/agentes.md` (o fluxo).

## Regras que não mudam
- **Conteúdo novo entra pela API, nunca por este repositório.** O produtor do tools grava em `learntech-content/content/`, e as cópias chegam aqui por `npm run copias`.
- **Arquivos gerados, não edite à mão:** `data/tools.js` e `data/host.js`; `sitemap.xml`.
- A resposta tardia da API troca os dados sem perder filtro (`app.usarDados` em `js/renderer.js`).
- **Privacidade:** nenhum dado pessoal de terceiro, nome de cliente ou link interno de ex-empregador. O Claude não lê nem cadastra segredos.

## Git
- Branch do dia `feature/tasks-DD-MM-AAAA`, criada da `main`. Depois: push, CI verde e `developer` por `--ff-only`.
- **O Claude para na `developer`.** A `main` é produção: quem leva a `developer` para a `main` é o autor (09/11/2026).
- A `main` é protegida: check `verificar` obrigatório e sem force push. Nunca commit direto na `main`.
- Comentários e issues no GitHub terminam com `<sub>por douglas ciborgue</sub>`.

## Comandos
| Comando | Para quê |
|---|---|
| `npm test` | node --test |
| `npm run lint` | ESLint |
| `npm run format:check` | Prettier (obrigatório na CI) |
| `npm run e2e` (em `learntech-content`) | fluxos e acessibilidade deste site contra a produção |
