/* dados.test.js — contrato das cópias de reserva geradas pela API (data/*.js). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { toolsList } from "../data/tools.js";
import { hostsList } from "../data/host.js";

for (const [nome, lista] of Object.entries({ toolsList, hostsList })) {
  test(`${nome}: títulos únicos e campos obrigatórios`, () => {
    assert.ok(lista.length > 0);
    const titulos = lista.map((i) => i.title.toLowerCase());
    assert.equal(new Set(titulos).size, titulos.length);
    for (const i of lista) {
      assert.match(i.site_url, /^https?:\/\//, i.title);
      assert.ok(i.category && i.pricing, i.title);
    }
  });
}
