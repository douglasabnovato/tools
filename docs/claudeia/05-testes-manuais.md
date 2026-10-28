# 05 · Testes manuais — tools

Pré-requisito local: servir por HTTP na raiz (`python -m http.server 3000`) e abrir `http://localhost:3000`. Abrir também o DevTools (F12 → Console).

## 1. Carga inicial

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 1.1 | Abrir a página | Aba "Ferramentas" ativa, título "Ferramentas que valeram o tempo", 12 cards, contador "Exibindo 12 de 45 ferramentas" | [ ] |
| 1.2 | Ver o Console | Só o aviso `[learntech-content] usando dados locais: API_URL não configurada...`; nenhum erro vermelho | [ ] |
| 1.3 | Ver os chips | "Todas 45" + 12 categorias com contagem, maior para menor (Comunidade 7 primeiro) | [ ] |
| 1.4 | Rolar a página | Miniaturas aparecem conforme os cards se aproximam | [ ] |
| 1.5 | Rodapé | Ano corrente; links learn-tech, Repositório, Sugerir ferramenta, GitHub, LinkedIn, Instagram | [ ] |

## 2. Seções

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 2.1 | Clicar "Hospedagens" | Título "Onde colocar o projeto no ar", 10 cards, chips Site Estático 6 / Aplicação 3 / Tempo Real 1, URL com `?s=host` | [ ] |
| 2.2 | Voltar para "Ferramentas" | Filtro e busca zerados, URL sem parâmetros | [ ] |

## 3. Filtros e busca

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 3.1 | Clicar chip "Design" | 6 cards, chip marcado, URL `?c=Design` | [ ] |
| 3.2 | Clicar "Design" de novo | Volta para Todas | [ ] |
| 3.3 | Digitar `codigo` (sem acento) | Itens da categoria "Código" aparecem | [ ] |
| 3.4 | Digitar `gratuito` | Só itens com cobrança Gratuito | [ ] |
| 3.5 | Digitar `xyzxyz` | "Nada encontrado" + botão "Limpar filtros"; clicar limpa tudo | [ ] |
| 3.6 | Pressionar `/` fora da busca | Foco vai para a busca | [ ] |
| 3.7 | Com texto na busca, `Esc` | Busca limpa | [ ] |
| 3.8 | Botão "x" da busca | Limpa e mantém o foco no campo | [ ] |
| 3.9 | Abrir `?s=host&c=Aplicação` em nova aba | Abre direto em Hospedagens › Aplicação (3 cards) | [ ] |
| 3.10 | Abrir `?c=Inexistente` | Ignora a categoria e mostra Todas | [ ] |

## 4. Paginação

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 4.1 | "Carregar mais" 3 vezes | 24 → 36 → 45; botão some; aparece "Fim da lista." | [ ] |

## 5. Cards e links externos

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 5.1 | Clicar em 5 cards de categorias diferentes | Abrem em nova aba no site correto | [ ] |
| 5.2 | Conferir as 4 miniaturas externas (PageSpeed Insights, Squoosh, Data Studio, Cloudflare Pages) | Ícone carregado, enquadrado (contain) | [ ] |
| 5.3 | Passar o mouse / Tab sobre um card | Destaque visível; foco com contorno | [ ] |
| 5.4 | (Recomendado) Abrir todos os 55 links uma vez por trimestre | Nenhum fora do ar ou redirecionando para outro produto | [ ] |

## 6. Temas

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 6.1 | Sistema em modo claro, 1ª visita (janela anônima) | Página em tema claro | [ ] |
| 6.2 | Clicar no botão de tema e recarregar | Escolha mantida | [ ] |
| 6.3 | Janela anônima com cookies/armazenamento bloqueados | Página abre normalmente (sem erro no Console) | [ ] |
| 6.4 | Conferir chips, cards, busca e rodapé nos dois temas | Sem texto ilegível | [ ] |

## 7. Celular e acessibilidade

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 7.1 | DevTools em 375 px e 768 px (ou celular real) | Sem rolagem horizontal; cabeçalho, abas e busca utilizáveis | [ ] |
| 7.2 | Toque nos chips e cards | Área de toque confortável | [ ] |
| 7.3 | Só teclado: Tab desde o topo | 1º foco é "Pular para o conteúdo"; percorre abas, busca, tema, chips, cards | [ ] |
| 7.4 | Leitor de tela (NVDA/Narrador) na busca | Contador de resultados é anunciado ao digitar | [ ] |
| 7.5 | SO com "reduzir movimento" | Sem animação de entrada da grade | [ ] |

## 8. Versão publicada (https://douglasabnovato.github.io/tools/)

| # | Ação | Esperado | OK |
| --- | --- | --- | --- |
| 8.1 | Abrir a URL | Mesma versão do repositório (tabs Ferramentas/Hospedagens, 45/10 itens) | [ ] |
| 8.2 | Console | Sem 404 de CSS, JS, miniatura ou favicon | [ ] |
| 8.3 | Colar a URL no LinkedIn/WhatsApp | Pré-visualização com título, descrição e imagem (se não houver imagem, ver E7) | [ ] |
| 8.4 | Celular: "Adicionar à tela inicial" | Ícone e nome "Tools" | [ ] |
| 8.5 | Após o push desta branch: aba Actions do GitHub | Workflow `ci` verde | [ ] |
