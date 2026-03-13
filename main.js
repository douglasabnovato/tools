const sectionCards = document.querySelector("#box-projects");
const originalCard = document.querySelector(".card");
const cardTemplate = originalCard.cloneNode(true); 
const menuLinks = document.querySelectorAll(".header-menu a");
const searchInput = document.getElementById("search-input");

let currentData = toolsList; // Lista atual (tools ou hosts)

originalCard.remove();

/**
 * Filtra os dados baseado na query de busca
 * @param {string} query - Termo de busca
 * @param {Array} data - Lista a ser filtrada
 * @returns {Array} - Lista filtrada
 */
function filterData(query, data) {
  if (!query.trim()) return data;
  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Renderiza a lista selecionada
 * @param {Array} data - Array de ferramentas ou hosts
 */
function render(data) {
  sectionCards.innerHTML = "";

  if (data.length === 0) {
    sectionCards.innerHTML = '<p class="empty-message">Nenhum item encontrado.</p>';
    return;
  }

  // Adicionar skeletons
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-card';
    skeleton.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-info"></div>
      <div class="skeleton-btn"></div>
    `;
    sectionCards.appendChild(skeleton);
  }

  // Simular delay de carregamento
  setTimeout(() => {
    sectionCards.innerHTML = ""; // Remove skeletons

    data.forEach((item) => {
      const card = cardTemplate.cloneNode(true);

      card.querySelector("img").src = item.thumb;
      card.querySelector("img").alt = item.title;
      card.querySelector(".title").innerText = item.title;
      card.querySelector(".text--medium").innerText = item.duration;
      card.querySelector(".badge").innerText = item.category;

      const visitBtn = card.querySelector('.visit-btn');
      visitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open(item.site_url, '_blank');
      });

      sectionCards.appendChild(card);
    });
  }, 800); // 800ms delay simulado
}

menuLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Estilo Active
    menuLinks.forEach((l) => {
      l.style.color = "var(--text-color)";
      l.removeAttribute("aria-pressed");
    });
    link.style.color = "var(--accent)";
    link.setAttribute("aria-pressed", "true");

    // Troca de Conteúdo
    if (index === 0) {
      currentData = toolsList;
      render(filterData(searchInput.value, currentData));
    }  
    if (index === 1) {
      currentData = hostsList;
      render(filterData(searchInput.value, currentData));
    }  
  });
});
 
window.onload = () => {
  if (typeof toolsList !== "undefined") {
    currentData = toolsList;
    render(currentData);
    menuLinks[0].style.color = "var(--accent)";
    menuLinks[0].setAttribute("aria-pressed", "true");
  }

  // Busca com debounce
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      render(filterData(searchInput.value, currentData));
    }, 300);
  });

  // Toggle tema
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    // Mudar ícone
    if (newTheme === 'light') {
      themeIcon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>';
    } else {
      themeIcon.innerHTML = '<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>';
    }
  });

  // Toggle menu mobile
  const menuToggle = document.getElementById('menu-toggle');
  const headerMenu = document.querySelector('.header-menu');
  menuToggle.addEventListener('click', () => {
    const isOpen = headerMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  // Ano dinâmico no footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
};
