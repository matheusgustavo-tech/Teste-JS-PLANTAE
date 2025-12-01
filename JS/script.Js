
const metas = [0, 200, 400, 600, 800, 1000];

const imagensArvore = [
  "img/arvoreN0.png",
  "img/arvoreN1.svg",
  "img/arvoreN2.svg",
  "img/arvoreN3.svg",
  "img/arvoreN4.svg",
  "img/arvoreN5.svg"
];

// ===== Seletores do HTML  =====
const tarefas = document.querySelectorAll(".tarefa"); // checkboxes
const barra = document.getElementById("barra");
const textoNivel = document.getElementById("textoNivel");
const textoFolhas = document.getElementById("textoFolhas");
const textoProx = document.getElementById("textoProx");
const imgArvore = document.getElementById("imgArvore");
const btnReiniciar = document.getElementById("btnReiniciar");
const resetarTexto = document.getElementById("resetar");
const metaLabel = document.getElementById("metaLabel");
const conquistas = document.querySelectorAll(".conquista-item");

// ===== Estado inicial (carrega do localStorage quando existir) =====
let folhas = Number(localStorage.getItem("folhas")) || 0;
let nivel = Number(localStorage.getItem("nivel")) || 0;

// Se não houver valor de contabilizada salvo, iniciamos com "false"
tarefas.forEach((t, i) => {
  // Se o elemento não tiver id, cria um id para salvar
  if (!t.id) t.id = "tarefa-" + i;
});

// ===== Função para restaurar estado das missões (checked + contabilizada) =====
function restaurarMissoes() {
  tarefas.forEach((t, i) => {
    const keyChecked = `tarefa_checked_${t.id}`;
    const keyCont = `tarefa_cont_${t.id}`;

    const savedChecked = localStorage.getItem(keyChecked);
    const savedCont = localStorage.getItem(keyCont);

    t.checked = savedChecked === "true";
    // Se não existir valor salvo, assume "false"
    t.dataset.contabilizada = savedCont === "true" ? "true" : "false";
  });
}

// ===== lucas usei aqui para conquistas salvas =====
function restaurarConquistas() {
  conquistas.forEach((c, i) => {
    const key = `conquista_${i}`;
    if (localStorage.getItem(key) === "true") {
      c.classList.add("desbloqueada");
    } else {
      c.classList.remove("desbloqueada");
    }
  });
}

// ===== Salvar todas chaves relevantes =====
function salvarTudo() {
  localStorage.setItem("folhas", String(folhas));
  localStorage.setItem("nivel", String(nivel));

  // salvar cada checkbox e seu estado contabilizada
  tarefas.forEach(t => {
    const keyChecked = `tarefa_checked_${t.id}`;
    const keyCont = `tarefa_cont_${t.id}`;
    localStorage.setItem(keyChecked, String(t.checked));
    localStorage.setItem(keyCont, String(t.dataset.contabilizada || "false"));
  });

  // salvar conquistas
  conquistas.forEach((c, i) => {
    localStorage.setItem(`conquista_${i}`, c.classList.contains("desbloqueada") ? "true" : "false");
  });
}

// ===== Atualizar conquistas (comportamento: quando folhas >= meta, marca desbloqueada) =====
function atualizarConquistas() {
  conquistas.forEach((c, i) => {
    const meta = Number(c.dataset.meta) || 0;
    if (folhas >= meta) {
      c.classList.add("desbloqueada");
    }
  });

  // ===== usando para salvar para futurando usar em outro local
  conquistas.forEach((c, i) => {
    localStorage.setItem(`conquista_${i}`, c.classList.contains("desbloqueada") ? "true" : "false");
  });
}

// ===== Atualizar UI =====
function atualizarUI() {
  
  const metaAtual = metas[nivel];
  const metaProx = metas[nivel + 1] !== undefined ? metas[nivel + 1] : metas[metas.length - 1];
  let progresso = ((folhas - metaAtual) / (metaProx - metaAtual)) * 100;
  if (!isFinite(progresso)) progresso = 0;
  if (progresso < 0) progresso = 0;
  if (progresso > 100) progresso = 100;

  barra.style.width = Math.round(progresso) + "%";
  barra.innerText = Math.round(progresso) + "%";

  textoNivel.innerText = `Nível ${nivel} — ${Math.round(progresso)}%`;
  textoFolhas.innerText = `🌱 ${folhas} folhas`;

  textoProx.innerText = (nivel < metas.length - 1)
    ? `Próximo nível em ${Math.max(0, metas[nivel + 1] - folhas)} folhas`
    : "Você chegou ao nível máximo! 🌳✨";

  metaLabel.innerText = (nivel < metas.length - 1)
    ? `${metas[nivel + 1]} folhas`
    : `${metas[metas.length - 1]} folhas`;

  // Atualiza imagem da árvore 
  const idxImg = Math.min(Math.max(0, nivel), imagensArvore.length - 1);
  if (imgArvore) imgArvore.src = imagensArvore[idxImg];

  atualizarConquistas();
  salvarTudo();
}

// ===== Função que verifica se subiu de nível e limpa checkboxes se subir =====
function verificarSubidaNivel() {
  let subiu = false;
  while (nivel < metas.length - 1 && folhas >= metas[nivel + 1]) {
    nivel++;
    subiu = true;
  }

  if (subiu) {

   
    tarefas.forEach(t => {
      t.checked = false;
      t.dataset.contabilizada = "false";
      localStorage.setItem(`tarefa_checked_${t.id}`, "false");
      localStorage.setItem(`tarefa_cont_${t.id}`, "false");
    });

    // atualizar UI e salvar
    atualizarUI();
  }
}


function onChangeTarefa(e) {
  const t = e.currentTarget;
  const valor = Number(t.value) || 0;

  // controle para contar apenas uma vez
  if (t.checked && t.dataset.contabilizada !== "true") {
    
    folhas += valor;
    t.dataset.contabilizada = "true";
  } else if (!t.checked && t.dataset.contabilizada === "true") {
    
    folhas -= valor;
    if (folhas < 0) folhas = 0;
    t.dataset.contabilizada = "false";
  } else {
    // caso marcado/desmarcado sem mudar contabilizada, nada a fazer
  }

  // salvar estado desta tarefa
  localStorage.setItem(`tarefa_checked_${t.id}`, String(t.checked));
  localStorage.setItem(`tarefa_cont_${t.id}`, String(t.dataset.contabilizada));

  // verifica subida de nível (se subir, as checkboxes serão apagadas lá)
  verificarSubidaNivel();

  // atualiza interface (que também salva estado)
  atualizarUI();
}

// ===== Eventos nas tarefas =====
tarefas.forEach(t => {
  
  if (typeof t.dataset.contabilizada === "undefined") t.dataset.contabilizada = "false";
  t.addEventListener("change", onChangeTarefa);
});

// ===== Botão REINICIAR: zera apenas missões (checkboxes + flags contabilizada) =====
btnReiniciar.addEventListener("click", () => {
  tarefas.forEach(t => {
    t.checked = false;
    t.dataset.contabilizada = "false";
    localStorage.setItem(`tarefa_checked_${t.id}`, "false");
    localStorage.setItem(`tarefa_cont_${t.id}`, "false");
  });

  // NÃO mexe em folhas / nível / conquistas
  atualizarUI();
});

// ===== Texto "Apagar tudo": zera tudo exceto conquistas =====
resetarTexto.addEventListener("click", () => {
 
  folhas = 0;
  nivel = 0;

  // limpa checkboxes
  tarefas.forEach(t => {
    t.checked = false;
    t.dataset.contabilizada = "false";
    localStorage.setItem(`tarefa_checked_${t.id}`, "false");
    localStorage.setItem(`tarefa_cont_${t.id}`, "false");
  });

  // NÃO apaga conquistas (conquistas permanecem no localStorage)
  atualizarUI();
});

// ===== Inicialização: restaurar estado salvo e atualizar a UI =====
restaurarMissoes();
restaurarConquistas();
atualizarUI();
