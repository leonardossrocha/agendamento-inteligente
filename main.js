// Inicializa os ícones
lucide.createIcons();

// Extraído do seu CSV enviado (RelacaoAlfa.csv) - Base de Leitura
const baseClientes = [
  {
    id: 1,
    nome: "ADEL MASSABKI JUNIOR",
    categoria: 5,
    especialidade: "GOB",
    cidade: "CAMBÉ",
  },
  {
    id: 2,
    nome: "ADRIANA MARTIN SWENSON",
    categoria: 4,
    especialidade: "DERMO",
    cidade: "LONDRINA",
  },
  {
    id: 3,
    nome: "AIDE MASSUMI OHE",
    categoria: 5,
    especialidade: "DERMO",
    cidade: "LONDRINA",
  },
  {
    id: 4,
    nome: "VANESSA SARTO SOARES",
    categoria: 2,
    especialidade: "GOB",
    cidade: "MARINGÁ",
  },
  {
    id: 5,
    nome: "VERA CRISTINA SCHNITZLER",
    categoria: 3,
    especialidade: "DERMO",
    cidade: "LONDRINA",
  },
  {
    id: 6,
    nome: "VERA L. RODRIGUES S. PEDRAO",
    categoria: 5,
    especialidade: "GOB",
    cidade: "LONDRINA",
  },
];

// Popula o select ao carregar a página
window.onload = () => {
  const select = document.getElementById("medicoSelect");
  baseClientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nome;
    select.appendChild(option);
  });
  atualizarBotoesRemover();
};

// Função principal do evento onChange
function atualizarCategoria() {
  const select = document.getElementById("medicoSelect");
  const clienteId = parseInt(select.value);
  const cliente = baseClientes.find((c) => c.id === clienteId);

  if (cliente) mostrarCategoria(cliente);
}

function mostrarCategoria(cliente) {
  const container = document.getElementById("categoriaContainer");
  const valor = document.getElementById("catValor");
  const badge = document.getElementById("catBadge");
  const mensagem = document.getElementById("catMensagem");
  const espValor = document.getElementById("espValor");
  const cidValor = document.getElementById("cidValor");

  container.classList.remove("hidden");
  valor.textContent = cliente.categoria;
  espValor.textContent = cliente.especialidade;
  cidValor.textContent = cliente.cidade;

  if (cliente.categoria <= 3) {
    container.className =
      "p-4 rounded-lg border-2 border-emerald-200 bg-emerald-50 transition-all duration-300 space-y-3";
    valor.className = "text-2xl font-black mt-1 text-emerald-700";
    badge.className =
      "px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1";
    badge.innerHTML = `<i data-lucide="star" class="w-4 h-4"></i> Cliente Potencial`;
    mensagem.textContent =
      "🎯 Foco na apresentação! Cliente com alta probabilidade.";
    mensagem.className = "text-sm mt-1 text-emerald-600 font-medium";
  } else {
    container.className =
      "p-4 rounded-lg border-2 border-orange-200 bg-orange-50 transition-all duration-300 space-y-3";
    valor.className = "text-2xl font-black mt-1 text-orange-700";
    badge.className =
      "px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 flex items-center gap-1";
    badge.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> Manutenção`;
    mensagem.textContent = "⏳ Visita de manutenção. Seja rápido e objetivo.";
    mensagem.className = "text-sm mt-1 text-orange-600 font-medium";
  }
  lucide.createIcons();
}

// --- Lógica para Múltiplas Datas/Horários ---
function adicionarData() {
  const container = document.getElementById("datasContainer");
  const novaLinha = document.createElement("div");
  novaLinha.className = "flex gap-2 items-center data-row mt-3";
  novaLinha.innerHTML = `
                <input type="date" required class="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                <input type="time" required class="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm">
                <button type="button" onclick="removerLinha(this)" class="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors btn-remover" title="Remover">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            `;
  container.appendChild(novaLinha);
  lucide.createIcons();
  atualizarBotoesRemover();
}

function removerLinha(btn) {
  const container = document.getElementById("datasContainer");
  if (container.children.length > 1) {
    btn.closest(".data-row").remove();
  }
  atualizarBotoesRemover();
}

function atualizarBotoesRemover() {
  const container = document.getElementById("datasContainer");
  const botoes = container.querySelectorAll(".btn-remover");
  if (botoes.length === 1) {
    botoes[0].disabled = true;
    botoes[0].classList.add("opacity-30", "cursor-not-allowed");
    botoes[0].classList.remove("hover:bg-red-50");
  } else {
    botoes.forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("opacity-30", "cursor-not-allowed");
      btn.classList.add("hover:bg-red-50");
    });
  }
}

// --- Lógica de Envio para agenda ---
function enviarFormulario(e) {
  e.preventDefault();

  // 1. Coleta os dados do Médico
  const select = document.getElementById("medicoSelect");
  const cliente = baseClientes.find((c) => c.id === parseInt(select.value));

  // 2. Coleta os Dias da Semana selecionados
  const diasCheckboxes = document.querySelectorAll(
    'input[name="dias"]:checked',
  );
  const diasSelecionados = Array.from(diasCheckboxes)
    .map((cb) => cb.value)
    .join(", ");

  // 3. Coleta as Datas e Horários
  const visitas = [];
  document.querySelectorAll(".data-row").forEach((row) => {
    const data = row.querySelector('input[type="date"]').value;
    const hora = row.querySelector('input[type="time"]').value;
    if (data && hora) visitas.push({ data, hora });
  });

  // 4. Monta o Payload (JSON) que será enviado para a API
  const payload = {
    medico: cliente.nome,
    categoria: cliente.categoria,
    especialidade: cliente.especialidade,
    cidade: cliente.cidade,
    dias_semana: diasSelecionados,
    agendamentos: visitas,
  };

  console.log("🚀 Dados prontos para gravar em agenda:", payload);

  // 5. Simula o envio (Efeito de Loading)
  const btnSubmit = document.getElementById("btnSubmit");
  const iconeOriginal = btnSubmit.innerHTML;

  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> <span>Salvando na agenda...</span>`;
  lucide.createIcons();

  // Simula o tempo de resposta da rede (1.5 segundos)
  setTimeout(() => {
    alert(
      `✅ Sucesso! Agendamento registrado para ${cliente.nome} em agenda`,
    );

    // Reseta o formulário
    document.getElementById("formAgendamento").reset();
    document.getElementById("categoriaContainer").classList.add("hidden");

    // Remove linhas extras de datas
    const datasContainer = document.getElementById("datasContainer");
    while (datasContainer.children.length > 1) {
      datasContainer.removeChild(datasContainer.lastChild);
    }
    atualizarBotoesRemover();

    // Volta o botão ao normal
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = iconeOriginal;
    lucide.createIcons();
  }, 1500);

  /* ========================================================================
            COMO SERÁ O CÓDIGO REAL AQUI (Integrando com Google Apps Script)
    ========================================================================
            fetch('https://script.google.com/macros/s/AKfycbzLTjy6vUJ_JCPJiQtFBajnHWpi5gWLtTyxmH5zbpicxjdBpK3fLXKMSaCyMEfeqhX1/exec', {
                method: 'POST',
                mode: 'no-cors', // Importante para evitar erro de CORS no Google
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                // Lógica de sucesso aqui
            }).catch(error => console.error('Erro:', error));
    ========================================================================
   */
}
