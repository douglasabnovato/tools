/* renderer.js — a aplicação do catálogo.
   Recebe as listas por parâmetro e cuida de seção, filtro, busca,
   paginação, carregamento preguiçoso das imagens, tema e estado na URL. */

import { debounce } from "./utils.js";
import { TODAS, filtrarCatalogo, contarCategorias, contarPrecos, valorValido } from "./filtros.js";

export function createApp({ toolsList, hostsList }) {
  const INICIAIS = 12;
  const INCREMENTO = 12;
  const CHAVE_TEMA = "tools:theme";

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
      subtitulo: "Plataformas de publicação que eu já usei, com o modelo de cobrança declarado em cada card.",
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
    filtroPreco: document.getElementById("filtro-preco"),
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

  const estado = { secao: "tools", categoria: TODAS, preco: TODAS, busca: "", visiveis: INICIAIS };

  const observador =
    "IntersectionObserver" in window
      ? new IntersectionObserver(aoEntrarNaTela, {
          rootMargin: "300px 0px",
          threshold: 0.01,
        })
      : null;

  /* Põe srcset e src guardados no dataset; o srcset vem antes para o navegador baixar só a versão escolhida. */
  function carregarImagem(img) {
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute("data-srcset");
    }
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    }
  }

  /* Troca a imagem placeholder pela real quando o card chega perto da janela. */
  function aoEntrarNaTela(entradas) {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      const img = entrada.target;
      carregarImagem(img);
      observador.unobserve(img);
    });
  }

  /* Aplica seção, categoria, cobrança e busca sobre a lista da seção corrente. */
  function filtrar() {
    return filtrarCatalogo(secoes[estado.secao].lista, estado);
  }

  /* Redesenha as duas barras. Cada contagem respeita o outro filtro: as categorias contam dentro da cobrança
     escolhida e a cobrança conta dentro da categoria escolhida (tools#56). */
  function montarFiltros() {
    const lista = secoes[estado.secao].lista;
    const naCobranca = filtrarCatalogo(lista, { preco: estado.preco });
    const naCategoria = filtrarCatalogo(lista, { categoria: estado.categoria });

    el.filtros.replaceChildren(...barra("categoria", "Todas", naCobranca.length, contarCategorias(naCobranca)));
    el.filtroPreco.replaceChildren(...barra("preco", "Qualquer cobrança", naCategoria.length, contarPrecos(naCategoria)));
  }

  /* Botões de uma barra. O filtro ativo continua na barra mesmo com 0 itens, para poder ser desmarcado. */
  function barra(campo, rotuloTodas, total, contagem) {
    const ativo = estado[campo];
    if (ativo !== TODAS && !contagem.some(([nome]) => nome === ativo)) contagem.push([ativo, 0]);
    return [criarChip(campo, TODAS, rotuloTodas, total), ...contagem.map(([nome, qtd]) => criarChip(campo, nome, nome, qtd))];
  }

  /* Monta um botão de filtro (categoria ou cobrança) já com o estado de pressionado correto. */
  function criarChip(campo, valor, texto, quantidade) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "chip";
    botao.dataset[campo] = valor;
    botao.setAttribute("aria-pressed", String(estado[campo] === valor));
    /* textContent em vez de innerHTML: a categoria pode vir da API e não deve virar HTML. */
    const contador = document.createElement("span");
    contador.className = "chip-count";
    contador.textContent = String(quantidade);
    botao.append(texto, contador);
    return botao;
  }

  /* Constrói um card a partir do template do HTML. */
  function criarCard(item) {
    const no = el.modelo.content.cloneNode(true);
    const link = no.querySelector(".card");
    const img = no.querySelector("img");

    if (item.slug && item.detalhe) {
      /* Item com página de detalhe: abre detalhe.html na mesma aba. */
      link.href = `detalhe.html?id=${encodeURIComponent(item.slug)}`; /* mesmo endereço do sitemap e do canonical; o serve.json mantém a query no npx serve. */
      link.removeAttribute("target");
      link.removeAttribute("rel");
      no.querySelector(".go").textContent = "→";
    } else {
      /* Só aceita link http(s): protege contra "javascript:" vindo de dado externo. */
      if (/^https?:\/\//i.test(String(item.site_url))) link.href = item.site_url;
      const aviso = document.createElement("span");
      aviso.className = "sr-only";
      aviso.textContent = " (abre em nova aba)";
      no.querySelector(".nome").after(aviso);
    }

    /* Sem aria-label: o nome do link é o texto visível do card, começando pelo nome da ferramenta (WCAG 2.5.3).
       A miniatura é decorativa (alt vazio do template): o nome já está no título ao lado. */
    img.dataset.src = item.thumb;
    /* Com a versão de 320 px, o card (até cerca de 260 px de largura) não baixa a de 640 px; tela densa ainda pega a maior (tools#55). */
    if (item.thumbPequena) {
      img.dataset.srcset = `${item.thumbPequena} 320w, ${item.thumb} 640w`;
      /* Larguras do .grid (layout.css): 1 coluna abaixo de 396 px, 2 colunas até 720 px e cards de cerca de 260 px acima disso. */
      img.sizes = "(max-width: 395px) calc(100vw - 32px), (max-width: 720px) calc(50vw - 26px), 320px";
    }
    if (item.thumbFit) img.dataset.fit = item.thumbFit;
    img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
    img.addEventListener("error", () => img.classList.add("is-loaded"), { once: true });

    if (observador) observador.observe(img);
    else carregarImagem(img);

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
    el.contador.textContent = total ? `Exibindo ${exibidos} de ${total} ${rotulo}` : `Nenhuma ${secoes[estado.secao].singular} encontrada`;

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
    if (estado.preco !== TODAS) params.set("preco", estado.preco);
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

    const lista = secoes[estado.secao].lista;
    estado.categoria = valorValido(lista, "category", params.get("c"));
    estado.preco = valorValido(lista, "pricing", params.get("preco"));
  }

  /* Escreve na tela os textos da seção ativa e marca a aba correspondente. */
  function aplicarSecao() {
    const secao = secoes[estado.secao];
    el.rotulo.textContent = secao.rotulo;
    el.titulo.textContent = secao.titulo;
    el.subtitulo.textContent = secao.subtitulo;
    document.title = `${secao.rotulo} | learnTECH Tools`;

    /* Padrão ARIA de abas: só a aba ativa entra no Tab; as setas trocam entre elas (ver ligarEventos). */
    for (const [chave, aba] of Object.entries(el.abas)) {
      aba.setAttribute("aria-selected", String(chave === estado.secao));
      aba.tabIndex = chave === estado.secao ? 0 : -1;
    }
    el.painel.setAttribute("aria-labelledby", `aba-${estado.secao}`);
  }

  /* Troca de seção zerando categoria, busca e paginação. */
  function trocarSecao(secao) {
    if (estado.secao === secao) return;
    estado.secao = secao;
    estado.categoria = TODAS;
    estado.preco = TODAS;
    estado.busca = "";
    estado.visiveis = INICIAIS;
    el.busca.value = "";

    aplicarSecao();
    montarFiltros();
    renderizar();
    sincronizarUrl();
  }

  /* Aplica uma categoria ou cobrança, permitindo desmarcar clicando na que já está ativa. */
  function trocarFiltro(campo, valor) {
    estado[campo] = estado[campo] === valor ? TODAS : valor;
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

    /* Setas, Home e End movem entre as abas e já ativam a seção (as abas são só duas). */
    el.abas.tools.parentElement.addEventListener("keydown", (evento) => {
      const ordem = Object.keys(el.abas);
      const atual = ordem.indexOf(estado.secao);
      const destino = {
        ArrowRight: (atual + 1) % ordem.length,
        ArrowLeft: (atual - 1 + ordem.length) % ordem.length,
        Home: 0,
        End: ordem.length - 1,
      }[evento.key];
      if (destino === undefined) return;
      evento.preventDefault();
      trocarSecao(ordem[destino]);
      el.abas[ordem[destino]].focus();
    });

    el.filtros.addEventListener("click", (evento) => {
      const chip = evento.target.closest("[data-categoria]");
      if (chip) trocarFiltro("categoria", chip.dataset.categoria);
    });

    el.filtroPreco.addEventListener("click", (evento) => {
      const chip = evento.target.closest("[data-preco]");
      if (chip) trocarFiltro("preco", chip.dataset.preco);
    });

    el.catalogo.addEventListener("click", (evento) => {
      if (!evento.target.closest('[data-acao="limpar"]')) return;
      estado.categoria = TODAS;
      estado.preco = TODAS;
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
      }, 250),
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
      /* "/" só vira atalho fora de campos de texto (ex.: o modal de identificação tem nome e e-mail). */
      const alvo = document.activeElement;
      const digitando = alvo && (alvo.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName));
      if (evento.key === "/" && !digitando) {
        evento.preventDefault();
        el.busca.focus();
      }
      if (evento.key === "Escape" && document.activeElement === el.busca) {
        el.limparBusca.click();
      }
    });

    window.addEventListener("scroll", () => el.cabecalho.classList.toggle("is-stuck", window.scrollY > 4), { passive: true });
  }

  let iniciado = false;

  /* Ponto de partida: lê a URL, monta a tela e liga os eventos. */
  function iniciar() {
    lerUrl();
    aplicarSecao();
    montarFiltros();
    renderizar();
    ligarEventos();
    el.ano.textContent = new Date().getFullYear();
    iniciado = true;
  }

  /* Troca as listas (ex.: a API respondeu depois da cópia local) mantendo seção, filtro, busca e paginação.
     Não religa eventos: ligarEventos roda uma vez só, em iniciar. */
  function usarDados(dados) {
    secoes.tools.lista = dados.toolsList;
    secoes.host.lista = dados.hostsList;
    if (!iniciado) return;
    const lista = secoes[estado.secao].lista;
    estado.categoria = valorValido(lista, "category", estado.categoria);
    estado.preco = valorValido(lista, "pricing", estado.preco);
    montarFiltros();
    renderizar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  } else {
    iniciar();
  }

  return { usarDados };
}

/* Fim de renderer.js */
