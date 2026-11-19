/* api.test.js — cliente da API com fetch simulado (sem rede). */
import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { apiConfigurada, buscarRecurso, resolverMidia } from "../js/api.js";

const original = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = original;
});

test("a API está configurada em js/config.js", () => assert.equal(apiConfigurada(), true));

test("buscarRecurso devolve o JSON e rejeita em erro", async () => {
  globalThis.fetch = async (url) => (String(url).endsWith("ok.json") ? { ok: true, json: async () => [1] } : { ok: false, status: 500 });
  assert.deepEqual(await buscarRecurso("ok.json"), [1]);
  await assert.rejects(buscarRecurso("falha.json"), /500/);
});

test("resolverMidia completa só caminhos /media/", () => {
  const [a, b] = resolverMidia([
    { thumb: "/media/t.webp", detalhe: { imagens: [{ url: "/media/i.webp" }] } },
    { thumb: "https://x.com/a.png" },
  ]);
  assert.match(a.thumb, /^https:\/\/.+\/media\/t\.webp$/);
  assert.match(a.detalhe.imagens[0].url, /\/media\/i\.webp$/);
  assert.equal(b.thumb, "https://x.com/a.png");
});

test("resolverMidia completa a thumbPequena e não a cria quando falta (tools#55)", () => {
  const [a, b] = resolverMidia([{ thumb: "/media/t.webp", thumbPequena: "/media/320/t.webp" }, { thumb: "/media/t.webp" }]);
  assert.match(a.thumbPequena, /^https:\/\/.+\/media\/320\/t\.webp$/);
  assert.equal("thumbPequena" in b, false);
});
