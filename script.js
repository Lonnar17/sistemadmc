// 🎮 ESTADO
let estado = {
  pontos: 0
};

// 🧍 ATRIBUTOS
const personagem = {
  danoBase: 5,
  proficiencia: 3
};

// 🎖️ RANK
function calcularRank(pontos) {
  if (pontos >= 10) return "SSS";
  if (pontos >= 7) return "SS";
  if (pontos >= 5) return "S";
  if (pontos >= 4) return "A";
  if (pontos >= 3) return "B";
  if (pontos >= 2) return "C";
  if (pontos >= 1) return "D";
  return "-";
}

// 🧠 HABILIDADES
const habilidadesPorRank = {
  "D": [{ nome: "Impulso Inicial", efeito: "1º acerto: +½ proficiência no ataque" }],
  "C": [{ nome: "Golpe Preciso", efeito: "+proficiência no dano" }],
  "B": [{ nome: "Armas Aprimoradas", efeito: "Armas favoritas +1 e contam como mágicasArmas favoritas +1 e contam como mágicas" }],
  "A": [{ nome: "Investida Brutal", efeito: "+3m movimento; corrida total permite derrubar (DT 8+prof+For)" }],
  "S": [{ nome: "Esquiva Reativa", efeito: "Reação: esquiva; se evitar ataque, move 3m sem oportunidade" }],
  "SS": [{ nome: "Crítico Aprimorado", efeito: "Crítico -1; crítico causa +1 dado de dano" }],
  "SSS": [{ nome: "Estilo Supremo", efeito: "Crítico -2; dano extra máximo; abate dá ataque extra" }]
};

function getHabilidadesAtuais(rank) {
  let lista = [];
  const ordem = ["D", "C", "B", "A", "S", "SS", "SSS"];

  for (let r of ordem) {
    if (habilidadesPorRank[r]) {
      lista = lista.concat(habilidadesPorRank[r]);
    }
    if (r === rank) break;
  }

  return lista;
}

// ⚔️ DANO
function calcularDano() {
  const rank = calcularRank(estado.pontos);

  let dano = personagem.danoBase;
  let magico = false;

  if (["C","B","A","S","SS","SSS"].includes(rank)) {
    dano += personagem.proficiencia;
  }

  if (["B","A","S","SS","SSS"].includes(rank)) {
    dano += 1;
    magico = true;
  }

  return { dano, magico };
}

// 🎮 AÇÕES
function acertou() {
  estado.pontos = Math.min(estado.pontos + 1, 10);
  atualizarUI();
}

function errou() {
  const rank = calcularRank(estado.pontos);

  if (["D","C","B","A"].includes(rank)) estado.pontos -= 1;
  else if (["S","SS"].includes(rank)) estado.pontos -= 2;
  else if (rank === "SSS") estado.pontos -= 3;

  estado.pontos = Math.max(estado.pontos, 0);
  atualizarUI();
}

function ativarDevilTrigger() {
  estado.pontos = Math.min(estado.pontos + 2, 10);

  const botao = document.querySelector(".devil");
  botao.classList.toggle("ativo");

  atualizarUI();
}

// 🖥️ UI
function atualizarUI() {
  const rank = calcularRank(estado.pontos);

  document.getElementById("pontos").innerText = estado.pontos;
  document.getElementById("rank").innerText = rank;

  const resultado = calcularDano();
  document.getElementById("dano").innerText =
    resultado.magico ? `${resultado.dano} (Mágico)` : `${resultado.dano} (Físico)`;

  const ul = document.getElementById("habilidades");
  ul.innerHTML = "";

  getHabilidadesAtuais(rank).forEach(hab => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${hab.nome}</strong><br><small>${hab.efeito}</small>`;
    ul.appendChild(li);
  });
}

// 🚀 START
atualizarUI();