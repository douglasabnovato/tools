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
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/* Fim de utils.js */
