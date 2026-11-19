/* video.js — endereços do vídeo do YouTube do detalhe: o embed sem cookie e a capa da fachada.
   A página mostra só a capa e um botão; o iframe (cerca de 1 MB de JS do YouTube) entra no clique. */

const VIDEO_YOUTUBE = /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/([\w-]{11})$/;

/* Id de 11 caracteres de um embed do YouTube, ou null se a URL não for um embed válido. */
export function idDoVideo(url) {
  const m = VIDEO_YOUTUBE.exec(String(url ?? ""));
  return m ? m[2] : null;
}

/* Embed no host youtube-nocookie; com autoplay porque só é montado depois do clique do visitante. */
export function urlDoEmbed(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
}

/* Capa do vídeo servida pelo YouTube (i.ytimg.com, liberado no img-src da CSP). */
export function urlDaCapa(id) {
  return `https://i.ytimg.com/vi_webp/${id}/hqdefault.webp`;
}

/* Fim de video.js */
