
console.log("SCRIPT CARREGADO");''

let pontos = 0;
const max = 10;

let danoBase = 5; // DEX 20
let proficiencia = 3;

/* RANK */
function getRank(pontos) {
  if (pontos === 0) return null;

  if (pontos >= 10) return "SSS";
  if (pontos >= 7) return "SS";
  if (pontos >= 5) return "S";
  if (pontos >= 4) return "A";
  if (pontos >= 3) return "B";
  if (pontos >= 2) return "C";
  return "D";
}

/* HABILIDADES */
const habilidadesPorRank = {
  "D": [{ nome: "Impulso Inicial", efeito: "1º acerto: metade da proficiência no ataque" }],
  "C": [{ nome: "Golpe Preciso", efeito: "+proficiência no dano" }],
  "B": [{ nome: "Armas Aprimoradas", efeito: "+1 e dano mágico" }],
  "A": [{ nome: "Investida Brutal", efeito: "+3m movimento; pode derrubar (DT 8+prof+For)" }],
  "S": [{ nome: "Esquiva Reativa", efeito: "Reação: esquiva + move 3m sem oportunidade" }],
  "SS": [{ nome: "Crítico Aprimorado", efeito: "Crítico -1; +1 dado de dano" }],
  "SSS": [{ nome: "Estilo Supremo", efeito: "Crítico -2; dano máximo; ataque extra" }]
};

const ordemRanks = ["D","C","B","A","S","SS","SSS"];

/* DANO */
function calcularDano() {
  let dano = danoBase;
  let tipo = "Físico";

  const rank = getRank(pontos);

  if (rank !== null) {

    // C+
    if (["C","B","A","S","SS","SSS"].includes(rank)) {
      dano += proficiencia;
    }

    // B+
    if (["B","A","S","SS","SSS"].includes(rank)) {
      dano += 1;
      tipo = "Mágico";
    }
  }

  document.getElementById("dano").innerText = dano;
  document.getElementById("tipoDano").innerText = tipo;
}

/* RENDER */
function renderHabilidades() {
  const container = document.getElementById("habilidades");
  container.innerHTML = "";

  const rankAtual = getRank(pontos);
  const indexAtual = rankAtual ? ordemRanks.indexOf(rankAtual) : -1;

  ordemRanks.forEach((rank, i) => {
    habilidadesPorRank[rank].forEach(hab => {

      const ativo = rankAtual !== null && i <= indexAtual;

      const div = document.createElement("div");
      div.classList.add("card");
      div.classList.add(ativo ? "ativo" : "bloqueado");

      div.innerHTML = `
        <h3>${hab.nome}</h3>
        <p>${hab.efeito}</p>
        ${!ativo ? `<span class="lock">🔒 desbloqueia no rank ${rank}</span>` : ""}
      `;

      container.appendChild(div);
    });
  });
}

/* UPDATE */
function atualizar() {
  document.getElementById("pontos").innerText = pontos;

  const rank = getRank(pontos);
  const rankEl = document.getElementById("rank");

  if (!rank) {
    rankEl.innerText = "-";
    rankEl.className = "";
  } else {
    rankEl.innerText = rank;
    rankEl.className = "";
    rankEl.classList.add(rank);
  }

  let porcentagem = (pontos / max) * 100;
  document.getElementById("progresso").style.width = porcentagem + "%";

  renderHabilidades();
  calcularDano();

  const rankTopo = document.getElementById("rankTopo");

if (rankTopo) {
  rankTopo.innerText = rank ? rank : "-";
}


}

/* BOTÕES */
function acerto() {
  console.log("ACERTO");
  pontos += 1;
  if (pontos > max) pontos = max;
  atualizar();
}

function erro() {
  console.log("ERRO");
  if (pontos === 0) return;

  const rank = getRank(pontos);

  if (["D","C","B","A"].includes(rank)) {
    pontos -= 1;
  } else if (["S","SS"].includes(rank)) {
    pontos -= 2;
  } else if (rank === "SSS") {
    pontos -= 3;
  }

  if (pontos < 0) pontos = 0;

  atualizar();
}

function devil() {
  console.log("DEVIL");
  pontos += 3;
  if (pontos > max) pontos = max;
  atualizar();
}

let bloqueado = false;

function devil() {
  if (bloqueado) return;
  bloqueado = true;

  pontos += 3;
  if (pontos > max) pontos = max;
  atualizar();

  setTimeout(() => bloqueado = false, 100);
}
