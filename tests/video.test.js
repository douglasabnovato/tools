/* video.test.js — id, embed e capa do vídeo da fachada do detalhe. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { idDoVideo, urlDoEmbed, urlDaCapa } from "../js/video.js";

test("extrai o id dos dois hosts de embed", () => {
  assert.equal(idDoVideo("https://www.youtube.com/embed/TxvFTg1jpI0"), "TxvFTg1jpI0");
  assert.equal(idDoVideo("https://www.youtube-nocookie.com/embed/TxvFTg1jpI0"), "TxvFTg1jpI0");
});

test("recusa o que não é embed do YouTube", () => {
  for (const url of [
    undefined,
    null,
    "",
    "https://www.youtube.com/watch?v=TxvFTg1jpI0",
    "https://evil.com/embed/TxvFTg1jpI0",
    "javascript:alert(1)",
    "https://www.youtube.com/embed/curto",
    "https://www.youtube.com/embed/TxvFTg1jpI0?x=1",
  ]) {
    assert.equal(idDoVideo(url), null, String(url));
  }
});

test("monta o embed sem cookie com autoplay e a capa do i.ytimg.com", () => {
  assert.equal(urlDoEmbed("TxvFTg1jpI0"), "https://www.youtube-nocookie.com/embed/TxvFTg1jpI0?autoplay=1");
  assert.equal(urlDaCapa("TxvFTg1jpI0"), "https://i.ytimg.com/vi_webp/TxvFTg1jpI0/hqdefault.webp");
});
