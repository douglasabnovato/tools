/* main.js — ponto de entrada: entrega os dados para a aplicação. */

import { toolsList } from "./data/tools.js";
import { hostsList } from "./data/host.js";
import { createApp } from "./js/renderer.js";
import { buscarRecurso, resolverMidia, esperarAte, carregarIdentificacao } from "./js/api.js";

const ESPERA_API_MS = 2500;

/* Busca ferramentas e hospedagens na API; devolve null quando ela falha, e o site segue com os dados locais. */
async function carregarCatalogo() {
  try {
    const [ferramentas, hospedagens] = await Promise.all([
      buscarRecurso("tools/ferramentas.json"),
      buscarRecurso("tools/hospedagens.json"),
    ]);
    return { toolsList: resolverMidia(ferramentas), hostsList: resolverMidia(hospedagens) };
  } catch (e) {
    console.warn("[learntech-content] usando dados locais:", e.message);
    return null;
  }
}

carregarIdentificacao("tools");
createApp((await esperarAte(carregarCatalogo(), ESPERA_API_MS)) ?? { toolsList, hostsList });

/* Fim de main.js */
