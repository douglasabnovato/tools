/* csp.test.js — a CSP das três páginas é a mesma, cobre a API e não libera script inline; o 404.html usa caminhos /tools/. */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { API_URL } from "../js/config.js";

const PAGINAS = ["index.html", "detalhe.html", "404.html"];
const ler = (arquivo) => fs.readFileSync(new URL(`../${arquivo}`, import.meta.url), "utf8");

/* Lê a CSP do <meta http-equiv> e devolve { diretiva: [fontes] }. */
function csp(html) {
  const m = /http-equiv="Content-Security-Policy"\s+content="([^"]+)"/.exec(html);
  assert.ok(m, 'página sem <meta http-equiv="Content-Security-Policy">');
  return Object.fromEntries(
    m[1]
      .split(";")
      .map((d) => d.trim().split(/\s+/))
      .filter((d) => d[0])
      .map(([nome, ...fontes]) => [nome, fontes]),
  );
}

test("as três páginas têm a mesma CSP", () => {
  const [primeira, ...outras] = PAGINAS.map((p) => csp(ler(p)));
  for (const outra of outras) assert.deepEqual(outra, primeira);
});

test("a CSP libera a API para dados, SDK e mídia", () => {
  const api = new URL(API_URL).origin;
  const c = csp(ler("index.html"));
  assert.ok(c["script-src"].includes(api), "script-src sem a API (SDK de identificação)");
  assert.ok(c["connect-src"].includes(api), "connect-src sem a API (catálogo e registro de acesso)");
  assert.ok(c["img-src"].includes(api), "img-src sem a API (/media/)");
});

test("a CSP não libera script inline nem eval", () => {
  const c = csp(ler("index.html"));
  assert.ok(!c["script-src"].includes("'unsafe-inline'"));
  assert.ok(!c["script-src"].includes("'unsafe-eval'"));
  assert.deepEqual(c["object-src"], ["'none'"]);
});

test("nenhuma página tem <script> inline nem atributo on*", () => {
  for (const p of PAGINAS) {
    const html = ler(p);
    for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) assert.match(tag, /\ssrc="/, `${p}: script inline bloqueado pela CSP: ${tag}`);
    assert.doesNotMatch(html, /\son[a-z]+="/, `${p}: atributo on* bloqueado pela CSP`);
  }
});

test("404.html usa só caminhos /tools/ que existem e aponta para o catálogo", () => {
  const html = ler("404.html");
  const locais = [...html.matchAll(/(?:src|href)="(\/[^"#?]*)/g)].map((m) => m[1]);
  assert.ok(locais.length > 0);
  for (const caminho of locais) {
    assert.match(caminho, /^\/tools\//, `caminho fora de /tools/: ${caminho}`);
    const arquivo = caminho.replace(/^\/tools\//, "") || "index.html";
    assert.ok(
      fs.existsSync(new URL(`../${arquivo.endsWith("/") ? arquivo + "index.html" : arquivo}`, import.meta.url)),
      `não existe: ${caminho}`,
    );
  }
  assert.doesNotMatch(html, /(?:src|href)="\.\//, "caminho relativo quebra em rotas profundas");
  assert.match(html, /href="\/tools\/"/);
  assert.match(html, /href="\/tools\/\?s=host"/);
});
