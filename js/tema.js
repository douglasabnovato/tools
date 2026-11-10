/* tema.js — aplica o tema salvo (ou o do sistema) antes de desenhar a página, para não piscar.
   Script clássico no <head>, sem defer. Fica em arquivo, e não inline, para a CSP não precisar de 'unsafe-inline' nem de hash. */

(function () {
  try {
    var salvo = localStorage.getItem("tools:theme");
    var prefereClaro = window.matchMedia("(prefers-color-scheme: light)").matches;
    document.documentElement.setAttribute("data-theme", salvo || (prefereClaro ? "light" : "dark"));
  } catch (e) {
    void e;
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();

/* Fim de tema.js */
