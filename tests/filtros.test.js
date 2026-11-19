/* filtros.test.js — filtro por categoria, cobrança e busca (tools#56). Rode com: npm test */
import { test } from "node:test";
import assert from "node:assert/strict";
import { TODAS, filtrarCatalogo, contarCategorias, contarPrecos, valorValido } from "../js/filtros.js";
import { toolsList } from "../data/tools.js";

const lista = [
  { title: "Alfa", description: "editor", category: "Design", pricing: "Gratuito" },
  { title: "Beta", description: "banco", category: "Dados", pricing: "Pago" },
  { title: "Gama", description: "editor de dados", category: "Dados", pricing: "Gratuito" },
  { title: "Delta", description: "antigo", category: "Design", pricing: "Descontinuado" },
];

test("filtra por cobrança e combina com categoria e busca", () => {
  assert.deepEqual(
    filtrarCatalogo(lista, { preco: "Gratuito" }).map((i) => i.title),
    ["Alfa", "Gama"],
  );
  assert.deepEqual(
    filtrarCatalogo(lista, { preco: "Gratuito", categoria: "Dados" }).map((i) => i.title),
    ["Gama"],
  );
  assert.deepEqual(
    filtrarCatalogo(lista, { preco: "Gratuito", busca: "EDITOR" }).map((i) => i.title),
    ["Alfa", "Gama"],
  );
  assert.deepEqual(filtrarCatalogo(lista, { preco: "Pago", categoria: "Design" }), []);
  assert.equal(filtrarCatalogo(lista, { categoria: TODAS, preco: TODAS }).length, 4);
  assert.equal(filtrarCatalogo(lista).length, 4);
});

test("conta a cobrança na ordem do mais acessível ao descontinuado", () => {
  assert.deepEqual(contarPrecos(lista), [
    ["Gratuito", 2],
    ["Pago", 1],
    ["Descontinuado", 1],
  ]);
  assert.deepEqual(contarCategorias(lista), [
    ["Dados", 2],
    ["Design", 2],
  ]);
});

test("valor da URL só vale se existir na lista", () => {
  assert.equal(valorValido(lista, "pricing", "Gratuito"), "Gratuito");
  assert.equal(valorValido(lista, "pricing", "Grátis"), TODAS);
  assert.equal(valorValido(lista, "pricing", null), TODAS);
});

test("no catálogo real, as cobranças somam o total e há ferramentas gratuitas", () => {
  const contagem = contarPrecos(toolsList);
  assert.equal(
    contagem.reduce((s, [, n]) => s + n, 0),
    toolsList.length,
  );
  assert.ok(filtrarCatalogo(toolsList, { preco: "Gratuito" }).length > 0);
});
