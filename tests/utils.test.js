/* utils.test.js — funções auxiliares sem DOM. Rode com: npm test (ou node --test "tests/*.test.js") */
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizar, debounce } from "../js/utils.js";

test("normalizar tira acento, caixa alta e espaços nas pontas", () => {
  assert.equal(normalizar("  Código Ágil "), "codigo agil");
});

test("debounce executa uma vez, com os argumentos da última chamada", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const chamadas = [];
  const f = debounce((v) => chamadas.push(v), 300);
  f(1); f(2); f(3);
  t.mock.timers.tick(299);
  assert.deepEqual(chamadas, []);
  t.mock.timers.tick(1);
  assert.deepEqual(chamadas, [3]);
});
