/* main.js — ponto de entrada: entrega os dados para a aplicação. */

import { toolsList } from "./data/tools.js";
import { hostsList } from "./data/host.js";
import { createApp } from "./js/renderer.js";
import { listaValida } from "./js/utils.js";
import { buscarRecurso, resolverMidia, esperarAte, carregarIdentificacao } from "./js/api.js";

/* Tempo máximo esperando a API antes de desenhar com a cópia local (mesmo valor do career). */
const ESPERA_API_MS = 1500;

/* Busca ferramentas e hospedagens na API; devolve null quando ela falha, e o site segue com os dados locais. */
async function carregarCatalogo() {
  try {
    const [ferramentas, hospedagens] = await Promise.all([
      buscarRecurso("tools/ferramentas.json"),
      buscarRecurso("tools/hospedagens.json"),
    ]);
    if (!listaValida(ferramentas) || !listaValida(hospedagens)) throw new Error("resposta da API em formato inesperado");
    return { toolsList: resolverMidia(ferramentas), hostsList: resolverMidia(hospedagens) };
  } catch (e) {
    console.warn("[learntech-content] usando dados locais:", e.message);
    return null;
  }
}

carregarIdentificacao("tools");
const remoto = carregarCatalogo();
const primeiro = await esperarAte(remoto, ESPERA_API_MS);
const app = createApp(primeiro ?? { toolsList, hostsList });

/* A API passou do tempo de espera: a cópia local já está na tela e, quando a resposta chegar,
   os dados novos entram sem recarregar (é a API que traz slug e detalhe para os cards abrirem detalhe.html). */
if (primeiro === undefined) {
  remoto.then((dados) => {
    if (dados) app.usarDados(dados);
  });
}

/* Fim de main.js */
