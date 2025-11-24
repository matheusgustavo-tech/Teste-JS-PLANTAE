// ========================================
// 1. Definindo metas e imagens da árvore
// ========================================

// Cada número é a quantidade de folhas necessária para passar de nível
const metas = [0, 200, 400, 600, 800, 1000];

// Imagens da árvore para cada nível
const imagensArvore = [
  "img/arvoreN0.png",
  "img/arvoreN1.svg",
  "img/arvoreN2.svg",
  "img/arvoreN3.svg",
  "img/arvoreN4.svg",
  "img/arvoreN5.svg"
];

// ========================================
// 2. Pegando os elementos do HTML
// ========================================

// Lista de checkboxes das tarefas
const tarefas = document.querySelectorAll(".tarefa");

// Barra de progresso
const barra = document.getElementById("barra");

// Textos que mostram o nível, folhas e próximo nível
const textoNivel = document.getElementById("textoNivel");
const textoFolhas = document.getElementById("textoFolhas");
const textoProx = document.getElementById("textoProx");

// Imagem da árvore que vai mudando
const imgArvore = document.getElementById("imgArvore");

// Botões de reiniciar e resetar
const btnReiniciar = document.getElementById("btnReiniciar");
const resetarTexto = document.getElementById("resetar");

// Label que mostra a meta do próximo nível
const metaLabel = document.getElementById("metaLabel");

// ========================================
// 3. Variáveis para controlar folhas e nível
// ========================================
let folhas = 0; // quantidade de folhas que o usuário tem
let nivel = 0;   // nível atual da árvore

// ========================================
// 4. Função para atualizar a interface
// ========================================
function atualizarUI() {
  // Meta do próximo nível
  let metaProximo = metas[nivel + 1] || metas[metas.length - 1];

  // Calculando porcentagem de progresso
  let progresso = ((folhas - metas[nivel]) / (metaProximo - metas[nivel])) * 100;
  if (progresso < 0) progresso = 0;
  if (progresso > 100) progresso = 100;

  // Atualiza barra de progresso
  barra.style.width = Math.round(progresso) + "%";
  barra.innerText = Math.round(progresso) + "%";

  // Atualiza textos
  textoNivel.innerText = `Nível ${nivel} — ${Math.round(progresso)}%`;
  textoFolhas.innerText = `🌱 ${folhas} folhas`;
  textoProx.innerText = (nivel < metas.length - 1) 
      ? `Próximo nível em ${metas[nivel + 1] - folhas} folhas`
      : "Você chegou ao nível máximo! 🌳✨";

  metaLabel.innerText = (nivel < metas.length - 1) 
      ? `${metas[nivel + 1]} folhas`
      : `${metas[metas.length - 1]} folhas`;

  // Muda a imagem da árvore de acordo com o nível
  imgArvore.src = imagensArvore[nivel];
}

// ========================================
// 5. Função para marcar tarefas
// ========================================
function marcarTarefas() {
  // Soma os valores das tarefas marcadas
  let soma = 0;
  tarefas.forEach(t => { if (t.checked) soma += Number(t.value); });

  let total = folhas + soma;

  // Verifica se passou de nível
  if (nivel < metas.length - 1 && total >= metas[nivel + 1]) {
    folhas = total;           // guarda as folhas
    nivel++;                  // sobe de nível
    tarefas.forEach(t => t.checked = false); // desmarca todas
  }

  // Calcula o progresso de novo
  let metaProximo = metas[nivel + 1] || metas[metas.length - 1];
  let progresso = ((total - metas[nivel]) / (metaProximo - metas[nivel])) * 100;
  if (progresso < 0) progresso = 0;
  if (progresso > 100) progresso = 100;

  // Atualiza barra e textos
  barra.style.width = Math.round(progresso) + "%";
  barra.innerText = Math.round(progresso) + "%";
  textoNivel.innerText = `Nível ${nivel} — ${Math.round(progresso)}%`;
  textoFolhas.innerText = `🌱 ${total} folhas`;
  textoProx.innerText = (nivel < metas.length - 1) 
      ? `Próximo nível em ${metas[nivel + 1] - total} folhas`
      : "Você chegou ao nível máximo! 🌳✨";

  // Atualiza imagem da árvore
  imgArvore.src = imagensArvore[nivel];
}

// ========================================
// 6. Eventos
// ========================================

// Quando muda alguma tarefa, chama marcarTarefas
tarefas.forEach(t => t.addEventListener("change", marcarTarefas));

// Quando clica em reiniciar ou resetar, zera tudo
btnReiniciar.addEventListener("click", () => {
  folhas = 0;
  nivel = 0;
  tarefas.forEach(t => t.checked = false);
  atualizarUI();
});

resetarTexto.addEventListener("click", () => {
  folhas = 0;
  nivel = 0;
  tarefas.forEach(t => t.checked = false);
  atualizarUI();
});

// ========================================
// 7. Inicializa a interface na tela
// ========================================
atualizarUI();

// parte do lucas

let mobileMenu = document.getElementById("mobileMenu");
let menu = document.getElementById("menu");

function abrirMenuMobile() {
    menu.classList.toggle("active");
}

mobileMenu.addEventListener('click', abrirMenuMobile);