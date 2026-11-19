/* filtros.js — filtro do catálogo por categoria, cobrança e busca (tools#56). Funções puras, sem DOM. */

import { normalizar } from "./utils.js";

export const TODAS = "todas";

/* Ordem dos modelos de cobrança na barra: do mais acessível ao descontinuado. Valor fora da lista vai para o fim. */
const ORDEM_PRECO = ["Gratuito", "Freemium", "Pago", "Descontinuado"];

/* Aplica categoria, cobrança e busca. TODAS (ou vazio) não filtra aquele campo. */
export function filtrarCatalogo(lista, { categoria = TODAS, preco = TODAS, busca = "" } = {}) {
  const termo = normalizar(busca);
  return (lista || []).filter(
    (item) =>
      (categoria === TODAS || !categoria || item.category === categoria) &&
      (preco === TODAS || !preco || item.pricing === preco) &&
      (!termo || normalizar(`${item.title} ${item.description} ${item.category} ${item.pricing}`).includes(termo)),
  );
}

/* Conta os itens por categoria, da maior para a menor (empate em ordem alfabética). */
export function contarCategorias(lista) {
  return [...contar(lista, "category").entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/* Conta os itens por modelo de cobrança, na ordem de ORDEM_PRECO. */
export function contarPrecos(lista) {
  const posicao = (p) => (ORDEM_PRECO.includes(p) ? ORDEM_PRECO.indexOf(p) : ORDEM_PRECO.length);
  return [...contar(lista, "pricing").entries()].sort((a, b) => posicao(a[0]) - posicao(b[0]) || a[0].localeCompare(b[0]));
}

/* Valor do filtro só vale se existir na lista; senão volta para TODAS (link antigo ou dado que mudou). */
export function valorValido(lista, campo, valor) {
  return valor && (lista || []).some((item) => item[campo] === valor) ? valor : TODAS;
}

function contar(lista, campo) {
  const contagem = new Map();
  for (const item of lista || []) {
    if (!item[campo]) continue;
    contagem.set(item[campo], (contagem.get(item[campo]) || 0) + 1);
  }
  return contagem;
}

/* Fim de filtros.js */
