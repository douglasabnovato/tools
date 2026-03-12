const sectionCards = document.querySelector("#box-projects");
const card = document.querySelector(".card");

const fullstacks = [
  {
    title: "Discord",
    duration: "1 dia",
    thumb: "./assets/thumbs/discord.jpg",
    site_url: "https://discord.com/",
    category: "Comunidade",
  },
  {
    title: "Hashnode",
    duration: "10 dias",
    thumb: "./assets/thumbs/hashnode.jpg",
    site_url: "https://hashnode.com/",
    category: "Comunidade",
  },
  {
    title: "StackOverflow",
    duration: "2 dias",
    thumb: "./assets/thumbs/stackoverflow.jpg",
    site_url: "https://stackoverflow.com/",
    category: "Comunidade",
  },
  {
    title: "Slack",
    duration: "1 dia",
    thumb: "./assets/thumbs/slack.jpg",
    site_url: "https://slack.com/",
    category: "Comunidade",
  },
  {
    title: "Pomodoro Online",
    duration: "1 dia",
    thumb: "./assets/thumbs/pomodoro.jpg",
    site_url: "https://pomofocus.io/",
    category: "Gestão de Projeto",
  },
  {
    title: "Notion",
    duration: "1 dia",
    thumb: "./assets/thumbs/notion.jpg",
    site_url: "https://www.notion.so/",
    category: "Gestão de Projeto",
  },
  {
    title: "Trello",
    duration: "1 dia",
    thumb: "./assets/thumbs/trello.jpg",
    site_url: "https://trello.com/",
    category: "Gestão de Projeto",
  },
  {
    title: "Figma",
    duration: "1 dia",
    thumb: "./assets/thumbs/figma.jpg",
    site_url: "https://www.figma.com/",
    category: "Design Web",
  },
  {
    title: "Codepen",
    duration: "1 dia",
    thumb: "./assets/thumbs/codepen.jpg",
    site_url: "https://codepen.io/",
    category: "Codar Online",
  },
  {
    title: "Codesandbox",
    duration: "1 dia",
    thumb: "./assets/thumbs/codesandbox.jpg",
    site_url: "https://codesandbox.io/",
    category: "Codar Online",
  },
  {
    title: "Github",
    duration: "1 dia",
    thumb: "./assets/thumbs/github.jpg",
    site_url: "https://github.com/",
    category: "Repositório de Código",
  },
  {
    title: "Postman",
    duration: "1 dia",
    thumb: "./assets/thumbs/postman.jpg",
    site_url: "https://www.postman.com/",
    category: "API",
  },
];

fullstacks.forEach((tool) => {
  const cardClone = card.cloneNode(true);

  cardClone.querySelector(".destino").href = tool.site_url;

  cardClone.querySelector("img").src = tool.thumb;

  cardClone.querySelector(".title").innerText = tool.title;

  cardClone.querySelector(".text--medium").innerText = tool.duration;

  cardClone.querySelector(".price").innerText = tool.category;

  sectionCards.appendChild(cardClone);
});

card.remove();
