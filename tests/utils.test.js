/* utils.test.js — funções auxiliares sem DOM. Rode com: npm test (ou node --test "tests/*.test.js") */
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, debounce, listaValida, cortarTexto } from "../js/utils.js";

test("normalizar tira acento, caixa alta e espaços nas pontas", () => {
  assert.equal(normalizar("  Código Ágil "), "codigo agil");
});

test("debounce executa uma vez, com os argumentos da última chamada", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const chamadas = [];
  const f = debounce((v) => chamadas.push(v), 300);
  f(1);
  f(2);
  f(3);
  t.mock.timers.tick(299);
  assert.deepEqual(chamadas, []);
  t.mock.timers.tick(1);
  assert.deepEqual(chamadas, [3]);
});

test("listaValida aceita só lista não vazia de itens com title e site_url", () => {
  assert.equal(listaValida([{ title: "Figma", site_url: "https://figma.com" }]), true);
  assert.equal(listaValida([]), false);
  assert.equal(listaValida(null), false);
  assert.equal(listaValida({ title: "x", site_url: "y" }), false);
  assert.equal(listaValida([{ title: "Figma" }]), false);
  assert.equal(listaValida([{ title: "Figma", site_url: "https://figma.com" }, null]), false);
});

test("cortarTexto respeita o limite sem partir palavra", () => {
  assert.equal(cortarTexto("  curto   demais "), "curto demais");
  const longo = "palavra ".repeat(40);
  const r = cortarTexto(longo, 160);
  assert.ok(r.length <= 160, String(r.length));
  assert.match(r, /palavra…$/);
  assert.equal(cortarTexto(undefined), "");
});
