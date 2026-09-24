/* renderer.js — a aplicação do catálogo.
   Recebe as listas por parâmetro e cuida de seção, filtro, busca,
   paginação, carregamento preguiçoso das imagens, tema e estado na URL. */

import { debounce, normalizar } from "./utils.js";

export function createApp({ toolsList, hostsList }) {
  const INICIAIS = 12;
  const INCREMENTO = 12;
  const CHAVE_TEMA = "tools:theme";
  const TODAS = "todas";

  const secoes = {
    tools: {
      lista: toolsList,
      rotulo: "Ferramentas",
      titulo: "Ferramentas que valeram o tempo",
      subtitulo:
        "Curadoria do que eu usei de verdade construindo produto e código. Sem lista de ranking, sem item que entrou só para engordar a contagem.",
      singular: "ferramenta",
      plural: "ferramentas",
    },
    host: {
      lista: hostsList,
      rotulo: "Hospedagens",
      titulo: "Onde colocar o projeto no ar",
      subtitulo:
        "Plataformas de publicação que eu já usei, com o modelo de cobrança declarado em cada card.",
      singular: "hospedagem",
      plural: "hospedagens",
    },
  };

  const el = {
    catalogo: document.getElementById("catalogo"),
    modelo: document.getElementById("modelo-card"),
    busca: document.getElementById("busca"),
    limparBusca: document.getElementById("limpar-busca"),
    filtros: document.getElementById("filtros"),
    contador: document.getElementById("contador"),
    verMais: document.getElementById("ver-mais"),
    fim: document.getElementById("fim-da-lista"),
    rotulo: document.getElementById("rotulo-secao"),
    titulo: document.getElementById("titulo-secao"),
    subtitulo: document.getElementById("subtitulo-secao"),
    painel: document.getElementById("conteudo"),
    cabecalho: document.getElementById("cabecalho"),
    tema: document.getElementById("alternar-tema"),
    ano: document.getElementById("ano"),
    abas: {
      tools: document.getElementById("aba-tools"),
      host: document.getElementById("aba-host"),
    },
  };

  const estado = { secao: "tools", categoria: TODAS, busca: "", visiveis: INICIAIS };

  const observador =
    "IntersectionObserver" in window
      ? new IntersectionObserver(aoEntrarNaTela, {
          rootMargin: "300px 0px",
          threshold: 0.01,
        })
      : null;

  /* Troca a imagem placeholder pela real quando o card chega perto da janela. */
  function aoEntrarNaTela(entradas) {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const img = entrada.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
      }
      observador.unobserve(img);
    });
  }

  /* Aplica seção, categoria e busca sobre a lista da seção corrente. */
  function filtrar() {
    const base = secoes[estado.secao].lista;
    const porCategoria =
      estado.categoria === TODAS
        ? base
        : base.filter((item) => item.category === estado.categoria);

    if (!estado.busca) return porCategoria;

    const termo = normalizar(estado.busca);
    return porCategoria.filter((item) =>
      normalizar(
        `${item.title} ${item.description} ${item.category} ${item.pricing}`
      ).includes(termo)
    );
  }

  /* Conta quantos itens da seção pertencem a cada categoria. */
  function contarCategorias() {
    const contagem = new Map();
    for (const item of secoes[estado.secao].lista) {
      contagem.set(item.category, (contagem.get(item.category) || 0) + 1);
    }
    return [...contagem.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }

  /* Redesenha a barra de filtros com o total de cada categoria. */
  function montarFiltros() {
    const total = secoes[estado.secao].lista.length;
    const partes = [criarChip(TODAS, "Todas", total)];
    for (const [nome, qtd] of contarCategorias()) {
      partes.push(criarChip(nome, nome, qtd));
    }
    el.filtros.replaceChildren(...partes);
  }

  /* Monta um botão de categoria já com o estado de pressionado correto. */
  function criarChip(valor, texto, quantidade) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "chip";
    botao.dataset.categoria = valor;
    botao.setAttribute("aria-pressed", String(estado.categoria === valor));
    botao.innerHTML = `${texto}<span class="chip-count">${quantidade}</span>`;
    return botao;
  }

  /* Constrói um card a partir do template do HTML. */
  function criarCard(item) {
    const no = el.modelo.content.cloneNode(true);
    const link = no.querySelector(".card");
    const img = no.querySelector("img");

    link.href = item.site_url;
    link.setAttribute("aria-label", `Abrir ${item.title} em uma nova aba`);

    img.alt = `Miniatura de ${item.title}`;
    img.dataset.src = item.thumb;
    if (item.thumbFit) img.dataset.fit = item.thumbFit;
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true });

    if (observador) observador.observe(img);
    else img.src = item.thumb;

    no.querySelector(".nome").textContent = item.title;
    no.querySelector(".card-desc").textContent = item.description;
    no.querySelector(".tag-cat").textContent = item.category;

    const preco = no.querySelector(".tag-price");
    preco.textContent = item.pricing;
    preco.dataset.price = item.pricing;

    return no;
  }

  /* Desenha o estado de lista vazia, com atalho para limpar os filtros. */
  function desenharVazio() {
    const caixa = document.createElement("div");
    caixa.className = "empty";
    caixa.innerHTML = `
      <h2>Nada encontrado</h2>
      <p>Nenhuma ${secoes[estado.secao].singular} corresponde aos filtros atuais.</p>
      <button type="button" class="btn-more" data-acao="limpar">Limpar filtros</button>`;
    el.catalogo.replaceChildren(caixa);
  }

  /* Atualiza o contador de resultados e os controles de paginação. */
  function atualizarControles(exibidos, total) {
    const rotulo = total === 1 ? secoes[estado.secao].singular : secoes[estado.secao].plural;
    el.contador.textContent = total
      ? `Exibindo ${exibidos} de ${total} ${rotulo}`
      : `Nenhuma ${secoes[estado.secao].singular} encontrada`;

    const acabou = exibidos >= total;
    el.verMais.hidden = acabou || total === 0;
    el.fim.hidden = !acabou || total === 0;
  }

  /* Renderiza a grade inteira a partir do estado corrente. */
  function renderizar() {
    const filtrados = filtrar();
    const visiveis = filtrados.slice(0, estado.visiveis);

    if (observador) observador.disconnect();

    if (filtrados.length === 0) {
      desenharVazio();
      atualizarControles(0, 0);
      return;
    }

    const fragmento = document.createDocumentFragment();
    visiveis.forEach((item) => fragmento.appendChild(criarCard(item)));

    el.catalogo.replaceChildren(fragmento);
    el.catalogo.classList.remove("grid-enter");
    void el.catalogo.offsetWidth;
    el.catalogo.classList.add("grid-enter");

    atualizarControles(visiveis.length, filtrados.length);
  }

  /* Reflete seção, categoria e busca na URL, para o filtro ser compartilhável. */
  function sincronizarUrl() {
    const params = new URLSearchParams();
    if (estado.secao !== "tools") params.set("s", estado.secao);
    if (estado.categoria !== TODAS) params.set("c", estado.categoria);
    if (estado.busca) params.set("q", estado.busca);
    const consulta = params.toString();
    history.replaceState(null, "", consulta ? `?${consulta}` : location.pathname);
  }

  /* Lê o estado inicial da URL, ignorando valores que não existem nos dados. */
  function lerUrl() {
    const params = new URLSearchParams(location.search);
    const secao = params.get("s");
    if (secao && secoes[secao]) estado.secao = secao;

    const busca = params.get("q");
    if (busca) {
      estado.busca = busca;
      el.busca.value = busca;
    }

    const categoria = params.get("c");
    const existe = secoes[estado.secao].lista.some((item) => item.category === categoria);
    if (categoria && existe) estado.categoria = categoria;
  }

  /* Escreve na tela os textos da seção ativa e marca a aba correspondente. */
  function aplicarSecao() {
    const secao = secoes[estado.secao];
    el.rotulo.textContent = secao.rotulo;
    el.titulo.textContent = secao.titulo;
    el.subtitulo.textContent = secao.subtitulo;
    document.title = `${secao.rotulo} | learnTECH Tools`;

    for (const [chave, aba] of Object.entries(el.abas)) {
      aba.setAttribute("aria-selected", String(chave === estado.secao));
    }
    el.painel.setAttribute("aria-labelledby", `aba-${estado.secao}`);
  }

  /* Troca de seção zerando categoria, busca e paginação. */
  function trocarSecao(secao) {
    if (estado.secao === secao) return;
    estado.secao = secao;
    estado.categoria = TODAS;
    estado.busca = "";
    estado.visiveis = INICIAIS;
    el.busca.value = "";

    aplicarSecao();
    montarFiltros();
    renderizar();
    sincronizarUrl();
  }

  /* Aplica uma categoria, permitindo desmarcar clicando na que já está ativa. */
  function trocarCategoria(valor) {
    estado.categoria = estado.categoria === valor ? TODAS : valor;
    estado.visiveis = INICIAIS;
    montarFiltros();
    renderizar();
    sincronizarUrl();
  }

  /* Grava e aplica o tema escolhido. */
  function definirTema(tema) {
    document.documentElement.setAttribute("data-theme", tema);
    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch (e) {
      void e;
    }
  }

  /* Liga todos os ouvintes de evento da página. */
  function ligarEventos() {
    el.abas.tools.addEventListener("click", () => trocarSecao("tools"));
    el.abas.host.addEventListener("click", () => trocarSecao("host"));

    el.filtros.addEventListener("click", (evento) => {
      const chip = evento.target.closest("[data-categoria]");
      if (chip) trocarCategoria(chip.dataset.categoria);
    });

    el.catalogo.addEventListener("click", (evento) => {
      if (!evento.target.closest('[data-acao="limpar"]')) return;
      estado.categoria = TODAS;
      estado.busca = "";
      estado.visiveis = INICIAIS;
      el.busca.value = "";
      montarFiltros();
      renderizar();
      sincronizarUrl();
    });

    el.busca.addEventListener(
      "input",
      debounce(() => {
        estado.busca = el.busca.value.trim();
        estado.visiveis = INICIAIS;
        renderizar();
        sincronizarUrl();
      }, 250)
    );

    el.limparBusca.addEventListener("click", () => {
      el.busca.value = "";
      estado.busca = "";
      estado.visiveis = INICIAIS;
      renderizar();
      sincronizarUrl();
      el.busca.focus();
    });

    el.verMais.addEventListener("click", () => {
      estado.visiveis += INCREMENTO;
      renderizar();
    });

    el.tema.addEventListener("click", () => {
      const atual = document.documentElement.getAttribute("data-theme");
      definirTema(atual === "dark" ? "light" : "dark");
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "/" && document.activeElement !== el.busca) {
        evento.preventDefault();
        el.busca.focus();
      }
      if (evento.key === "Escape" && document.activeElement === el.busca) {
        el.limparBusca.click();
      }
    });

    window.addEventListener(
      "scroll",
      () => el.cabecalho.classList.toggle("is-stuck", window.scrollY > 4),
      { passive: true }
    );
  }

  /* Ponto de partida: lê a URL, monta a tela e liga os eventos. */
  function iniciar() {
    lerUrl();
    aplicarSecao();
    montarFiltros();
    renderizar();
    ligarEventos();
    el.ano.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }
}

/* Fim de renderer.js */
