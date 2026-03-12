const sectionCards = document.querySelector("section.cards");

const card = document.querySelector("div.card");

const fullstacks = [
  {
    title: "netlify",
    duration: "10 dias",
    thumb: "../files/thumb_host/netlify.jpg",
    site_url: "https://www.netlify.com/",
    category: "Servidor de Hospedagem"
  },
  {
    title: "vercel",
    duration: "10 dias",
    thumb: "../files/thumb_host/vercel.jpg",
    site_url: "https://vercel.com/dashboard",
    category: "Servidor de Hospedagem"
  },
  {
    title: "surge",
    duration: "10 dias",
    thumb: "../files/thumb_host/surge.jpg",
    site_url: "https://surge.sh/",
    category: "Servidor de Hospedagem"
  },
  {
    title: "github pages",
    duration: "10 dias",
    thumb: "../files/thumb_host/github-pages.jpg",
    site_url: "https://pages.github.com/",
    category: "Servidor de Hospedagem"
  },
  {
    title: "gitlab pages",
    duration: "10 dias",
    thumb: "../files/thumb_host/gitlab-pages.jpg",
    site_url: "https://about.gitlab.com/",
    category: "Servidor de Hospedagem"
  },
  {
    title: "Firebase",
    duration: "10 dias",
    thumb: "../files/thumb_host/firebase.jpg",
    site_url: "https://firebase.google.com/docs/hosting?hl=pt-br",
    category: "Servidor de Hospedagem"
  },
  {
    title: "railway",
    duration: "10 dias",
    thumb: "../files/thumb_host/railway.jpg",
    site_url: "https://railway.app/",
    category: "Servidor de Hospedagem"
  },
  {
    title: "pusher",
    duration: "10 dias",
    thumb: "../files/thumb_host/pusher.jpg",
    site_url: "https://dashboard.pusher.com/",
    category: "Servidor de Hospedagem"
  },
  {
    title: "heroku",
    duration: "10 dias",
    thumb: "../files/thumb_host/heroku.jpg",
    site_url: "https://www.heroku.com/",
    category: "Servidor de Hospedagem"
  },
]

fullstacks.map((fullstack) => {
  const cardClone = card.cloneNode(true);
  cardClone.querySelector("a.destino").href = fullstack.site_url;
  cardClone.querySelector("img").src = fullstack.thumb;
  cardClone.querySelector(".title").innerHTML = fullstack.title;
  cardClone.querySelector(".info > p.text--medium").innerHTML = fullstack.duration;
  cardClone.querySelector(".info > p.price").innerHTML = fullstack.category;
  sectionCards.appendChild(cardClone);
});

card.remove();