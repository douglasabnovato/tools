/* ==========================================================================
   ESTADO GLOBAL E SELETORES
   ========================================================================== */
const sectionCards = document.querySelector("#box-projects");
const originalCard = document.querySelector(".card");
const cardTemplate = originalCard.cloneNode(true);
const searchInput = document.getElementById("search-input");

// Elementos de UI de Paginação
const loadMoreBtn = document.getElementById("load-more");
const endMessage = document.getElementById("all-loaded-message");
const itemsCounter = document.getElementById("items-counter");

// Remove o card estático inicial
originalCard.remove();

// Regras de Exibição
const INITIAL_ITEMS = 12;
const INCREMENT_ITEMS = 8;

let currentData = typeof toolsList !== "undefined" ? toolsList : [];
let itemsToShow = INITIAL_ITEMS;
let activeType = "tools";

const sectionContent = {
  tools: {
    title: 'Ferramentas <span class="highlight">LearnTECH</span>',
    subtitle:
      "Explorando as melhores soluções para otimizar meu workflow de desenvolvimento.",
    list: typeof toolsList !== "undefined" ? toolsList : [],
    label: "ferramentas",
  },
  host: {
    title: 'Hospedagem <span class="highlight">LearnTECH</span>',
    subtitle:
      "Serviços e infraestruturas para colocar seus projetos online com performance e segurança.",
    list: typeof hostsList !== "undefined" ? hostsList : [],
    label: "hospedagens",
  },
};

/* ==========================================================================
   LÓGICA DE FILTRO E RENDERIZAÇÃO
   ========================================================================== */

/**
 * Filtra os dados com base no input de busca
 */
function filterData(query, data) {
  if (!query.trim()) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Renderiza os cards respeitando a hierarquia de Busca e Paginação
 */
function render() {
  // 1. Hierarquia: Primeiro filtra a lista inteira
  const filteredData = filterData(searchInput.value, currentData);

  // 2. Depois aplica a paginação sobre o resultado do filtro
  const totalInFiltered = filteredData.length;
  const dataToDisplay = filteredData.slice(0, itemsToShow);
  const currentDisplayed = dataToDisplay.length;

  // 3. Limpa o grid para nova renderização
  sectionCards.innerHTML = "";

  // 4. Mapeia e injeta os cards
  dataToDisplay.forEach((item) => {
    const card = cardTemplate.cloneNode(true);

    // Configura os dados do card
    card.querySelector("img").src = item.thumb;
    card.querySelector("img").alt = item.title;
    card.querySelector(".title").innerText = item.title;
    card.querySelector(".text--medium").innerText = item.duration;
    card.querySelector(".badge").innerText = item.category;

    // Evento de visita
    card.querySelector(".visit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      window.open(item.site_url, "_blank");
    });

    sectionCards.appendChild(card);
  });

  // 5. Atualiza o Contador (Ex: 12 / 42 ferramentas)
  if (itemsCounter) {
    itemsCounter.innerHTML = `Exibindo <strong>${currentDisplayed}</strong> de <strong>${totalInFiltered}</strong> ${sectionContent[activeType].label}`;
  }

  // 6. Regra da Mensagem Final vs Botão "Carregar Mais"
  if (currentDisplayed >= totalInFiltered) {
    loadMoreBtn.style.display = "none";
    // Só exibe a mensagem de fim se houver algum item na lista
    endMessage.style.display = totalInFiltered > 0 ? "block" : "none";
  } else {
    loadMoreBtn.style.display = "block";
    endMessage.style.display = "none";
  }
}

/* ==========================================================================
   CONTROLE DE NAVEGAÇÃO E EVENTOS
   ========================================================================== */

/**
 * Altera entre Ferramentas e Hospedagem
 */
function changeContext(type) {
  activeType = type;
  const content = sectionContent[type];

  // Reset de estado ao trocar de aba
  itemsToShow = INITIAL_ITEMS;
  currentData = content.list;

  // Atualiza Textos do Header
  document.getElementById("section-title").innerHTML = content.title;
  document.getElementById("section-subtitle").textContent = content.subtitle;

  // Gerencia classe Active no Menu
  document
    .querySelectorAll(".nav-link")
    .forEach((link) => link.classList.remove("active"));
  const activeNav = document.getElementById(`nav-${type}`);
  if (activeNav) activeNav.classList.add("active");

  // Roda a animação de fade no header
  const header = document.querySelector(".section-header");
  header.classList.remove("fadeIn");
  void header.offsetWidth;
  header.classList.add("fadeIn");

  render();
}

window.onload = () => {
  // Inicialização padrão
  changeContext("tools");

  // Evento: Carregar Mais (Incremento de 8)
  loadMoreBtn.addEventListener("click", () => {
    itemsToShow += INCREMENT_ITEMS;
    render();
  });

  // Evento: Busca (Reset de paginação para 12 a cada tecla)
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      itemsToShow = INITIAL_ITEMS;
      render();
    }, 300);
  });

  // Eventos de Navegação
  document.getElementById("nav-tools").addEventListener("click", (e) => {
    e.preventDefault();
    changeContext("tools");
  });

  document.getElementById("nav-host").addEventListener("click", (e) => {
    e.preventDefault();
    changeContext("host");
  });

  // Toggle de Tema (Dark/Light)
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");

  themeToggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);

    // Troca o SVG dinamicamente se necessário
    if (newTheme === "light") {
      themeIcon.innerHTML =
        '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
    } else {
      themeIcon.innerHTML =
        '<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>';
    }
  });

  // Toggle Menu Mobile
  const menuToggle = document.getElementById("menu-toggle");
  const headerMenu = document.querySelector(".header-menu");
  menuToggle.addEventListener("click", () => {
    const isOpen = headerMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Ano Dinâmico
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
};
