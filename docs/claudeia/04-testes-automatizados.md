# 04 · Testes automatizados — tools

Site estático, sem build e sem dependências: os testes possíveis sem instalar nada são **verificações estáticas**. Não há teste de comportamento (clique, busca, filtro) — isso fica no roteiro manual (05).

## Como rodar (Windows, na raiz do projeto)

```powershell
powershell -ExecutionPolicy Bypass -File docs/claudeia/verificar.ps1
```

Saída: linhas `[OK]`, `[AVISO]` e `[ERRO]`, e no fim `Resultado: N erro(s), M aviso(s).` Código de saída 1 se houver erro. Aviso não falha.

## O que é verificado

| # | Verificação | Tipo |
| --- | --- | --- |
| 1 | Todo `src`/`href` local (`./...`) do index.html existe | Erro |
| 1 | `lang="pt-BR"` e meta description presentes | Erro |
| 1 | Os 17 ids que `js/renderer.js` busca existem no index.html | Erro |
| 2 | Todo `import ... from "./..."` de main.js e js/*.js aponta para arquivo existente | Erro |
| 3 | Em data/tools.js e data/host.js: mesma quantidade de title/description/category/pricing/thumb/site_url | Erro |
| 3 | Título duplicado; `site_url` sem https; `pricing` fora de Gratuito/Freemium/Pago | Erro |
| 3 | Miniatura local inexistente | Erro |
| 3 | Miniatura externa (google.com/s2/favicons) | Aviso |
| 4 | `public/site.webmanifest` é JSON válido e os ícones existem | Erro |
| 5 | Contagem do Readme ("45 ferramentas · 10 hospedagens") bate com os dados | Aviso |
| 5 | `js/config.js` ainda com placeholder (API e identificação desligadas) | Aviso |
| 5 | Arquivo em `assets/` não referenciado; imagem acima de 300 KB | Aviso |

O CI (`.github/workflows/ci.yml`) roda o mesmo script e, em seguida, `node --input-type=module --check` em main.js, js/*.js e data/*.js (erro de sintaxe JS quebra o build).

Resultado esperado hoje: **0 erros, 15 avisos** (4 miniaturas externas, placeholder da API, 2 órfãos, 8 imagens > 300 KB).

## O que NÃO é coberto

| Lacuna | Por quê | Onde cobrir |
| --- | --- | --- |
| Links externos respondendo (55 sites + 4 favicons) | Exige rede e sofre com bloqueio anti-robô; daria falso negativo no CI | Manual (05) ou, se aprovado, job semanal com `lychee` (dependência nova) |
| Comportamento: busca, filtro, paginação, tema, URL | Sem navegador headless sem instalar dependência | Manual (05); proposta futura com Playwright |
| Visual, responsivo, contraste | Idem | Manual (05) |
| Integração com a API e script de identificação | API desligada (placeholder) | Manual, após P-01 |
| Validade do JS em tempo de execução | `--check` só valida sintaxe | Manual (console sem erros) |
| Versão publicada no GitHub Pages | Script olha só os arquivos locais | Manual (05, seção 8) |
| Parser de dados | Lê data/*.js por expressão regular, supondo strings em aspas duplas (padrão atual) | Se o formato mudar, ajustar o script |
