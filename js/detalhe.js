/* detalhe.js — página de detalhe de uma ferramenta ou hospedagem.
   Lê ?id=<slug>, procura o item nas duas listas da API e monta a página só com
   createElement/textContent (nenhum dado externo vira HTML). */

import { apiConfigurada, buscarRecurso, resolverMidia, carregarIdentificacao } from "./api.js";

const CHAVE_TEMA = "tools:theme";
const FORMATO_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const VIDEO_YOUTUBE = /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/([\w-]{11})$/;

const LISTAS = [
  { caminho: "tools/ferramentas.json", secao: "tools" },
  { caminho: "tools/hospedagens.json", secao: "host" },
];

const el = {
  estado: document.getElementById("estado"),
  artigo: document.getElementById("detalhe"),
  voltar: document.getElementById("voltar"),
  tema: document.getElementById("alternar-tema"),
  cabecalho: document.getElementById("cabecalho"),
  ano: document.getElementById("ano"),
  descricao: document.querySelector('meta[name="description"]'),
};

/* Só aceita URL http(s): protege contra "javascript:" e similares vindos de dado externo. */
function urlSegura(valor) {
  return typeof valor === "string" && /^https?:\/\//i.test(valor) ? valor : null;
}

/* Imagem aceita http(s) ou caminho ./assets/ do próprio site (como a miniatura do card). */
function srcImagem(valor) {
  return urlSegura(valor) ?? (typeof valor === "string" && /^\.\/assets\/[\w./-]+$/.test(valor) ? valor : null);
}

/* Cria um elemento com classe e texto opcionais. */
function criar(tag, classe, texto) {
  const no = document.createElement(tag);
  if (classe) no.className = classe;
  if (texto !== undefined) no.textContent = texto;
  return no;
}

/* Link externo em nova aba, ou null se a URL não for http(s). */
function linkExterno(url, texto, classe) {
  const href = urlSegura(url);
  if (!href) return null;
  const a = criar("a", classe, texto);
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

/* "2026-10-28" -> "28/10/2026", sem passar por Date (evita erro de fuso). */
function formatarData(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
  return m ? `${m[3]}/${m[2]}/${m[1]}` : null;
}

/* Força o host youtube-nocookie; devolve null se não for um embed válido. */
function videoSemCookie(url) {
  const m = VIDEO_YOUTUBE.exec(String(url));
  return m ? `https://www.youtube-nocookie.com/embed/${m[2]}` : null;
}

/* Volta para o catálogo mantendo seção, filtro e busca quando o visitante veio dele. */
function definirVoltar(secao) {
  let href = secao === "host" ? "index.html?s=host" : "index.html";
  try {
    const origem = new URL(document.referrer);
    const pastaAtual = location.pathname.replace(/[^/]*$/, "");
    const ehCatalogo = origem.pathname === pastaAtual || origem.pathname === `${pastaAtual}index.html`;
    if (origem.origin === location.origin && ehCatalogo) href = `index.html${origem.search}`;
  } catch (e) {
    void e; /* sem referrer ou referrer inválido: fica o padrão */
  }
  el.voltar.href = href;
}

/* Troca o bloco de estado por uma mensagem com link de volta (e, opcionalmente, o site oficial). */
function mostrarMensagem(titulo, texto, item) {
  const caixa = criar("div", "empty");
  caixa.append(criar("h1", "detalhe-estado-titulo", titulo), criar("p", null, texto));
  const acoes = criar("div", "detalhe-estado-acoes");
  const voltar = criar("a", "btn-more", "Voltar para as ferramentas");
  voltar.href = el.voltar.getAttribute("href");
  acoes.append(voltar);
  const site = item && linkExterno(item.site_url, "Acessar site oficial", "btn-primary");
  if (site) acoes.append(site);
  caixa.append(acoes);
  el.estado.replaceChildren(caixa);
  el.estado.removeAttribute("aria-busy");
  document.title = `${titulo} | learnTECH Tools`;
}

/* Lista de links (redes ou fontes) dentro de uma seção com título. */
function secaoLinks(titulo, lista, classe) {
  const itens = (Array.isArray(lista) ? lista : [])
    .map((l) => linkExterno(l?.url, String(l?.label ?? ""), null))
    .filter((a) => a && a.textContent);
  if (!itens.length) return null;
  const secao = criar("section", `detalhe-links ${classe}`);
  secao.append(criar("h2", null, titulo));
  const ul = criar("ul");
  for (const a of itens) {
    const li = criar("li");
    li.append(a);
    ul.append(li);
  }
  secao.append(ul);
  return secao;
}

/* Monta a página inteira do item. */
function renderizar(item) {
  const d = item.detalhe;
  const frag = document.createDocumentFragment();

  /* Topo: miniatura + título, etiquetas, resumo e botão principal. */
  const topo = criar("header", "detalhe-topo");
  const midia = criar("div", "detalhe-thumb");
  const thumb = srcImagem(item.thumb);
  if (thumb) {
    const img = criar("img");
    img.src = thumb;
    img.alt = `Miniatura de ${item.title}`;
    img.width = 640;
    img.height = 400;
    img.decoding = "async";
    if (item.thumbFit) img.dataset.fit = item.thumbFit;
    midia.append(img);
  }

  const info = criar("div", "detalhe-info");
  const tags = criar("div", "card-tags detalhe-tags");
  if (item.category) tags.append(criar("span", "tag tag-cat", String(item.category)));
  if (item.pricing) {
    const preco = criar("span", "tag tag-price", String(item.pricing));
    preco.dataset.price = String(item.pricing);
    tags.append(preco);
  }
  info.append(criar("h1", "detalhe-titulo", String(item.title)), tags, criar("p", "detalhe-resumo", String(d.resumo)));
  const site = linkExterno(item.site_url, "Acessar site oficial", "btn-primary");
  if (site) {
    site.setAttribute("aria-label", `Acessar site oficial de ${item.title} em uma nova aba`);
    site.append(criar("span", "btn-seta", " ↗"));
    site.lastChild.setAttribute("aria-hidden", "true");
    info.append(site);
  }
  topo.append(midia, info);
  frag.append(topo);

  /* Corpo: parágrafos, vídeo e galeria. */
  const corpo = criar("div", "detalhe-corpo");
  const texto = criar("div", "detalhe-texto");
  for (const p of d.paragrafos) texto.append(criar("p", null, String(p)));
  corpo.append(texto);

  const video = d.video && videoSemCookie(d.video);
  if (video) {
    const caixa = criar("div", "detalhe-video");
    const iframe = criar("iframe");
    iframe.src = video;
    iframe.title = `Vídeo sobre ${item.title}`;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    caixa.append(iframe);
    corpo.append(caixa);
  }

  const imagens = (Array.isArray(d.imagens) ? d.imagens : []).filter((i) => srcImagem(i?.url) && i.alt);
  if (imagens.length) {
    const galeria = criar("section", "detalhe-galeria");
    galeria.setAttribute("aria-label", `Imagens de ${item.title}`);
    for (const i of imagens) {
      const fig = criar("figure");
      const img = criar("img");
      img.src = srcImagem(i.url);
      img.alt = String(i.alt);
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 1600;
      img.height = 1000;
      fig.append(img);
      if (i.legenda) fig.append(criar("figcaption", null, String(i.legenda)));
      galeria.append(fig);
    }
    corpo.append(galeria);
  }

  /* Links oficiais, fontes e data de atualização. */
  const rodape = criar("footer", "detalhe-rodape");
  const links = secaoLinks("Links oficiais", d.links, "detalhe-redes");
  const fontes = secaoLinks("Fontes", d.fontes, "detalhe-fontes");
  if (links) rodape.append(links);
  if (fontes) rodape.append(fontes);
  const data = formatarData(d.atualizadoEm);
  if (data) {
    const p = criar("p", "detalhe-atualizado", "Atualizado em ");
    const t = criar("time", null, data);
    t.dateTime = d.atualizadoEm;
    p.append(t);
    rodape.append(p);
  }
  if (rodape.childNodes.length) corpo.append(rodape);
  frag.append(corpo);

  el.artigo.replaceChildren(frag);
  el.artigo.hidden = false;
  el.estado.hidden = true;
  el.estado.removeAttribute("aria-busy");

  document.title = `${item.title} | learnTECH Tools`;
  if (el.descricao) el.descricao.setAttribute("content", String(d.resumo));
}

/* Confere o mínimo para montar a página. */
function detalheValido(item) {
  const d = item?.detalhe;
  return Boolean(item?.title && d && d.resumo && Array.isArray(d.paragrafos) && d.paragrafos.length);
}

/* Busca as duas listas; devolve { item, secao } ou um motivo de falha. */
async function procurar(slug) {
  const respostas = await Promise.allSettled(LISTAS.map((l) => buscarRecurso(l.caminho)));
  let falhou = false;
  for (const [i, r] of respostas.entries()) {
    if (r.status !== "fulfilled" || !Array.isArray(r.value)) {
      falhou = true;
      console.warn("[learntech-content] falha ao buscar", LISTAS[i].caminho, r.reason?.message ?? "formato inesperado");
      continue;
    }
    const item = resolverMidia(r.value).find((x) => x && x.slug === slug);
    if (item) return { item, secao: LISTAS[i].secao };
  }
  return { motivo: falhou ? "indisponivel" : "nao-encontrado" };
}

/* Tema e cabeçalho fixo, iguais aos do catálogo (mesma chave no localStorage). */
function ligarTema() {
  el.tema?.addEventListener("click", () => {
    const novo = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", novo);
    try {
      localStorage.setItem(CHAVE_TEMA, novo);
    } catch (e) {
      void e;
    }
  });
  window.addEventListener("scroll", () => el.cabecalho?.classList.toggle("is-stuck", window.scrollY > 4), {
    passive: true,
  });
}

async function iniciar() {
  ligarTema();
  if (el.ano) el.ano.textContent = new Date().getFullYear();
  definirVoltar();
  el.estado.setAttribute("aria-busy", "true");

  const slug = new URLSearchParams(location.search || location.hash.slice(1)).get("id") ?? ""; /* aceita ?id= e #id= */
  if (!FORMATO_SLUG.test(slug)) {
    mostrarMensagem("Ferramenta não encontrada", "O endereço não aponta para nenhuma ferramenta do catálogo.");
    return;
  }

  if (!apiConfigurada()) {
    mostrarMensagem("Detalhes indisponíveis", "Os detalhes ficam disponíveis quando a API está ativa. Enquanto isso, o catálogo continua funcionando.");
    return;
  }

  const r = await procurar(slug);
  if (r.item) definirVoltar(r.secao);

  if (r.motivo === "indisponivel" && !r.item) {
    mostrarMensagem("Detalhes indisponíveis", "Os detalhes ficam disponíveis quando a API está ativa. Tente de novo em alguns minutos.");
  } else if (!r.item) {
    mostrarMensagem("Ferramenta não encontrada", "Não há nenhuma ferramenta ou hospedagem com esse endereço no catálogo.");
  } else if (!detalheValido(r.item)) {
    mostrarMensagem(String(r.item.title), "Este item ainda não tem página de detalhe.", r.item);
  } else {
    renderizar(r.item);
  }
}

carregarIdentificacao("tools");
iniciar();

/* Fim de detalhe.js */
