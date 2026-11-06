/* utils.js — funções auxiliares sem dependência de DOM. */

/* Adia a execução até parar de receber chamadas por `espera` milissegundos. */
export function debounce(fn, espera = 300) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
}

/* Deixa o texto em caixa baixa e sem acento, para a busca casar "codigo" com "código". */
export function normalizar(texto) {
  return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

/* Confere se a API devolveu uma lista não vazia de itens com título e link; senão o site usa os dados locais. */
export function listaValida(lista) {
  return Array.isArray(lista) && lista.length > 0 && lista.every((item) => item && item.title && item.site_url);
}

/* Corta o texto em até `max` caracteres sem partir palavra, com reticências (ex.: meta description). */
export function cortarTexto(texto, max = 160) {
  const limpo = String(texto ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (limpo.length <= max) return limpo;
  const corte = limpo.slice(0, max - 1);
  const espaco = corte.lastIndexOf(" ");
  return `${(espaco > max / 2 ? corte.slice(0, espaco) : corte).replace(/[\s,.;:]+$/, "")}…`;
}

/* Fim de utils.js */
