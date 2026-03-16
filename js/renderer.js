/* renderer.js */
import { debounce } from "./utils.js";

export function createApp({ toolsList, hostsList }) {
  // --- SELETORES E CONSTANTES ---
  const sectionCards = document.querySelector("#box-projects");
  const cardTemplate = document.querySelector("#card-template");
  const searchInput = document.getElementById("search-input");
  const loadMoreBtn = document.getElementById("load-more");
  const endMessage = document.getElementById("all-loaded-message");
  const itemsCounter = document.getElementById("items-counter");

  const INITIAL_ITEMS = 12;
  const INCREMENT_ITEMS = 8;

  let currentData = toolsList;
  let itemsToShow = INITIAL_ITEMS;
  let activeType = "tools";

  // --- CONFIGURAÇÕES DE CONTEÚDO ---
  const sectionContent = {
    tools: {
      title: 'Ferramentas <span class="highlight">LearnTECH</span>',
      subtitle:
        "As melhores soluções para otimizar meu workflow de desenvolvimento.",
      list: toolsList,
      label: "ferramentas",
    },
    host: {
      title: 'Hospedagem <span class="highlight">LearnTECH</span>',
      subtitle: "Infraestruturas para performance e segurança.",
      list: hostsList,
      label: "hospedagens",
    },
  };

  // --- LAZY LOADING OTIMIZADO ---
  const imageObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  img.classList.add("loaded"); // Gancho para CSS transitions
                  img.removeAttribute("data-src");
                }
                imageObserver.unobserve(img);
              }
            });
          },
          { rootMargin: "200px 0px", threshold: 0.1 },
        )
      : null;

  // --- LÓGICA DE NEGÓCIO (FILTRO E BUSCA) ---
  function getFilteredData() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return currentData;

    return currentData.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    );
  }

  // --- RENDERIZAÇÃO ---
  function render() {
    const filtered = getFilteredData();
    const totalItems = filtered.length;
    const toDisplay = filtered.slice(0, itemsToShow);

    // Desconecta observers antigos antes de limpar o DOM
    if (imageObserver) imageObserver.disconnect();
    sectionCards.innerHTML = "";

    // 1. Estado Vazio (Early Return)
    if (totalItems === 0) {
      renderEmptyState();
      return;
    }

    // 2. Fragmento para performance (Minimiza Reflows)
    const fragment = document.createDocumentFragment();

    toDisplay.forEach((item, index) => {
      const cardClone = cardTemplate.content.cloneNode(true);
      const card = cardClone.querySelector(".card");

      // Animação Staggered
      card.style.setProperty("--delay", `${(index % 8) * 0.1}s`);
      card.classList.add("show");

      // Imagem e Lazy Load
      const img = card.querySelector("img");
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.dataset.src = item.thumb;
      img.alt = item.title;

      if (imageObserver) imageObserver.observe(img);
      else img.src = item.thumb;

      // Preenchimento de dados
      card.querySelector(".title").textContent = item.title;
      card.querySelector(".text--medium").textContent = item.duration;
      card.querySelector(".badge").textContent = item.category;

      // Link (usando dataset para delegação de eventos se necessário,
      // mas mantendo o botão para acessibilidade)
      card.querySelector(".visit-btn").onclick = () =>
        window.open(item.site_url, "_blank");

      fragment.appendChild(cardClone);
    });

    sectionCards.appendChild(fragment);
    updateUIControls(toDisplay.length, totalItems);
  }

  // --- HELPERS DE UI ---
  function renderEmptyState() {
    const label = sectionContent[activeType].label;
    sectionCards.innerHTML = `
      <div class="empty-search-container">
        <p class="empty-search-message">Nenhuma ${label.slice(0, -1)} encontrada para sua busca.</p>
        <span class="empty-search-icon">🔍</span>
      </div>`;
    updateUIControls(0, 0);
  }

  function updateUIControls(current, total) {
    if (itemsCounter) {
      itemsCounter.innerHTML =
        total > 0
          ? `Exibindo <strong>${current}</strong> de <strong>${total}</strong> ${sectionContent[activeType].label}`
          : `0 de 0 ${sectionContent[activeType].label}`;
    }

    const isDone = current >= total;
    loadMoreBtn.style.display = isDone || total === 0 ? "none" : "block";
    endMessage.style.display = isDone && total > 0 ? "block" : "none";
  }

  function changeContext(type) {
    if (activeType === type) return;

    activeType = type;
    itemsToShow = INITIAL_ITEMS;
    currentData = sectionContent[type].list;

    // UI Updates
    document.getElementById("section-title").innerHTML =
      sectionContent[type].title;
    document.getElementById("section-subtitle").textContent =
      sectionContent[type].subtitle;

    document
      .querySelectorAll(".nav-link")
      .forEach((link) =>
        link.classList.toggle("active", link.id === `nav-${type}`),
      );

    // Reinicia animação do header
    const header = document.querySelector(".section-header");
    header.classList.remove("fadeIn");
    void header.offsetWidth;
    header.classList.add("fadeIn");

    render();
  }

  // --- INICIALIZAÇÃO E EVENTOS ---
  function init() {
    // Header Scroll
    const siteHeader = document.querySelector(".site-header");
    window.addEventListener(
      "scroll",
      () => {
        siteHeader.classList.toggle("header-scrolled", window.scrollY > 50);
      },
      { passive: true },
    );

    // Menu Mobile e Tema
    setupCoreUI();

    // Eventos de Busca e Filtro
    loadMoreBtn.addEventListener("click", () => {
      itemsToShow += INCREMENT_ITEMS;
      render();
    });

    searchInput.addEventListener(
      "input",
      debounce(() => {
        itemsToShow = INITIAL_ITEMS;
        render();
      }, 300),
    );

    // Navegação de Contexto
    document.getElementById("nav-tools")?.addEventListener("click", (e) => {
      e.preventDefault();
      changeContext("tools");
    });

    document.getElementById("nav-host")?.addEventListener("click", (e) => {
      e.preventDefault();
      changeContext("host");
    });

    // Ano do Rodapé
    const yearElement = document.getElementById("year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Primeira renderização
    changeContext("tools");
  }

  function setupCoreUI() {
    const menuToggle = document.getElementById("menu-toggle");
    const headerMenu = document.querySelector(".header-menu");
    const themeToggle = document.getElementById("theme-toggle");

    menuToggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = headerMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (e) => {
      if (!headerMenu?.contains(e.target) && !menuToggle?.contains(e.target)) {
        headerMenu?.classList.remove("open");
        menuToggle?.setAttribute("aria-expanded", "false");
      }
    });

    themeToggle?.addEventListener("click", () => {
      const doc = document.documentElement;
      const isDark = doc.getAttribute("data-theme") === "dark";
      const nextTheme = isDark ? "light" : "dark";
      doc.setAttribute("data-theme", nextTheme);

      const icon = themeToggle.querySelector("i");
      if (icon)
        icon.className = nextTheme === "dark" ? "bx bx-sun" : "bx bx-moon";
    });
  }

  // Lifecycle
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
}
