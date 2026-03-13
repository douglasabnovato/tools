/* ==========================================================================
   CONFIGURAÇÕES E ESTADO GLOBAL
   ========================================================================== */
const sectionCards = document.querySelector("#box-projects");
const originalCard = document.querySelector(".card");
const cardTemplate = originalCard.cloneNode(true);
const searchInput = document.getElementById("search-input");

// Remove o card estático do HTML para começar do zero
originalCard.remove();

let currentData = typeof toolsList !== "undefined" ? toolsList : [];

/**
 * Objeto Único de Verdade (Single Source of Truth) para o conteúdo das seções
 * Integrando os textos e as listas de dados (toolsList e hostsList)
 */
const sectionContent = {
  tools: {
    title: 'Ferramentas <span class="highlight">LearnTECH</span>',
    subtitle:
      "Explorando as melhores soluções para otimizar meu workflow de desenvolvimento.",
    list: typeof toolsList !== "undefined" ? toolsList : [],
  },
  host: {
    title: 'Hospedagem <span class="highlight">LearnTECH</span>',
    subtitle:
      "Serviços e infraestruturas para colocar seus projetos online com performance e segurança.",
    list: typeof hostsList !== "undefined" ? hostsList : [],
  },
};

/* ==========================================================================
   LÓGICA DE NAVEGAÇÃO E CONTEXTO
   ========================================================================== */

/**
 * Altera o contexto da página (Textos, Links Ativos e Lista de Dados)
 * @param {string} type - 'tools' ou 'host'
 */
function changeContext(type) {
  const content = sectionContent[type];
  if (!content) return;

  // 1. Atualiza Título e Subtítulo
  const titleElement = document.getElementById("section-title");
  const subtitleElement = document.getElementById("section-subtitle");

  titleElement.innerHTML = content.title;
  subtitleElement.textContent = content.subtitle;

  // 2. Gerencia a classe 'active' nos links do menu
  const navTools = document.getElementById("nav-tools");
  const navHost = document.getElementById("nav-host");

  if (type === "tools") {
    navTools.classList.add("active");
    navHost.classList.remove("active");
  } else {
    navHost.classList.add("active");
    navTools.classList.remove("active");
  }

  // 3. Atualiza a referência de dados e renderiza
  currentData = content.list;
  render(filterData(searchInput.value, currentData));

  // 4. Trigger de animação de entrada
  const header = document.querySelector(".section-header");
  header.classList.remove("fadeIn");
  void header.offsetWidth; // Force reflow
  header.classList.add("fadeIn");
}

/* ==========================================================================
   FILTRAGEM E RENDERIZAÇÃO
   ========================================================================== */

function filterData(query, data) {
  if (!query.trim()) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(
    (item) =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery),
  );
}

function render(data) {
  sectionCards.innerHTML = "";

  if (data.length === 0) {
    sectionCards.innerHTML =
      '<p class="empty-message">Nenhum item encontrado.</p>';
    return;
  }

  // Skeletons para o efeito de carregamento
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card";
    skeleton.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-info"></div>
      <div class="skeleton-btn"></div>
    `;
    sectionCards.appendChild(skeleton);
  }

  setTimeout(() => {
    sectionCards.innerHTML = ""; // Limpa skeletons

    data.forEach((item) => {
      const card = cardTemplate.cloneNode(true);

      card.querySelector("img").src = item.thumb;
      card.querySelector("img").alt = item.title;
      card.querySelector(".title").innerText = item.title;
      card.querySelector(".text--medium").innerText = item.duration;
      card.querySelector(".badge").innerText = item.category;

      const visitBtn = card.querySelector(".visit-btn");
      visitBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.open(item.site_url, "_blank");
      });

      sectionCards.appendChild(card);
    });
  }, 800);
}

/* ==========================================================================
   INICIALIZAÇÃO E EVENTOS
   ========================================================================== */

window.onload = () => {
  // Inicializa com Ferramentas
  changeContext("tools");

  // Gatilhos do Menu de Navegação
  const btnTools = document.getElementById("nav-tools");
  const btnHost = document.getElementById("nav-host");

  btnTools.addEventListener("click", (e) => {
    e.preventDefault();
    changeContext("tools");
  });

  btnHost.addEventListener("click", (e) => {
    e.preventDefault();
    changeContext("host");
  });

  // Busca com debounce
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      render(filterData(searchInput.value, currentData));
    }, 300);
  });

  // Tema Dark/Light
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);

    themeIcon.innerHTML =
      newTheme === "light"
        ? '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>'
        : '<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>';
  });

  // Menu Mobile
  const menuToggle = document.getElementById("menu-toggle");
  const headerMenu = document.querySelector(".header-menu");
  menuToggle.addEventListener("click", () => {
    const isOpen = headerMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Rodapé
  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
};
