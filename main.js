// Inicializa os ícones
lucide.createIcons();

// A URL OFICIAL DO SEU BACK-END NO GOOGLE
const API_URL = "https://script.google.com/macros/s/AKfycbzLTjy6vUJ_JCPJiQtFBajnHWpi5gWLtTyxmH5zbpicxjdBpK3fLXKMSaCyMEfeqhX1/exec";

// Variável global que receberá os dados reais da planilha RelacaoAlfa
let baseClientes = [];

// ==========================================
// 1. LEITURA (GET) - Carrega os médicos
// ==========================================
window.onload = async () => {
  const select = document.getElementById("medicoSelect");
  select.innerHTML = '<option value="" disabled selected>Carregando médicos da base...</option>';
  atualizarBotoesRemover();
  
  try {
      // Faz a requisição real para o Google Apps Script
      const resposta = await fetch(API_URL);
      const json = await resposta.json();
      
      if(json.status === 'sucesso') {
          baseClientes = json.dados;
          
          // Limpa o select e popula com os dados da planilha
          select.innerHTML = '<option value="" disabled selected>Escolha um cliente na base...</option>';
          baseClientes.forEach((cliente) => {
              const option = document.createElement("option");
              option.value = cliente.id;
              option.textContent = cliente.nome;
              select.appendChild(option);
          });
      } else {
          select.innerHTML = '<option value="" disabled selected>Erro ao carregar dados</option>';
          console.error("Erro da API:", json.mensagem);
      }
  } catch (error) {
      select.innerHTML = '<option value="" disabled selected>Falha na conexão com o Drive</option>';
      console.error("Erro de rede:", error);
  }
};

// ==========================================
// 2. LÓGICA DE INTERFACE (UI)
// ==========================================
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
    container.className = "p-4 rounded-lg border-2 border-emerald-200 bg-emerald-50 transition-all duration-300 space-y-3";
    valor.className = "text-2xl font-black mt-1 text-emerald-700";
    badge.className = "px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1";
    badge.innerHTML = `<i data-lucide="star" class="w-4 h-4"></i> Cliente Potencial`;
    mensagem.textContent = "🎯 Foco na apresentação! Cliente com alta probabilidade.";
    mensagem.className = "text-sm mt-1 text-emerald-600 font-medium";
  } else {
    container.className = "p-4 rounded-lg border-2 border-orange-200 bg-orange-50 transition-all duration-300 space-y-3";
    valor.className = "text-2xl font-black mt-1 text-orange-700";
    badge.className = "px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 flex items-center gap-1";
    badge.innerHTML = `<i data-lucide="alert-circle" class="w-4 h-4"></i> Manutenção`;
    mensagem.textContent = "⏳ Visita de manutenção. Seja rápido e objetivo.";
    mensagem.className = "text-sm mt-1 text-orange-600 font-medium";
  }
  lucide.createIcons();
}

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

// ==========================================
// 3. GRAVAÇÃO (POST) - Envia para a agenda
// ==========================================
async function enviarFormulario(e) {
  e.preventDefault();

  const select = document.getElementById("medicoSelect");
  const cliente = baseClientes.find((c) => c.id === parseInt(select.value));

  const diasCheckboxes = document.querySelectorAll('input[name="dias"]:checked');
  const diasSelecionados = Array.from(diasCheckboxes).map((cb) => cb.value).join(", ");

  const visitas = [];
  document.querySelectorAll(".data-row").forEach((row) => {
    const data = row.querySelector('input[type="date"]').value;
    const hora = row.querySelector('input[type="time"]').value;
    if (data && hora) visitas.push({ data, hora });
  });

  const payload = {
    medico: cliente.nome,
    categoria: cliente.categoria,
    especialidade: cliente.especialidade,
    cidade: cliente.cidade,
    dias_semana: diasSelecionados,
    agendamentos: visitas,
  };

  // Efeito de Loading Visual (Botão bloqueado)
  const btnSubmit = document.getElementById("btnSubmit");
  const iconeOriginal = btnSubmit.innerHTML;
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> <span>Salvando na agenda...</span>`;
  lucide.createIcons();

  try {
      // O PULO DO GATO PARA VENCER O CORS:
      // Enviar como 'text/plain' evita a requisição de pré-voo (OPTIONS) no navegador
      const resposta = await fetch(API_URL, {
          method: "POST",
          headers: {
              "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
      });

      const json = await resposta.json();

      if(json.status === 'sucesso') {
          alert(`✅ Sucesso! Agendamento registrado para ${cliente.nome} em agenda.xlsx`);

          // Reseta a interface
          document.getElementById("formAgendamento").reset();
          document.getElementById("categoriaContainer").classList.add("hidden");

          const datasContainer = document.getElementById("datasContainer");
          while (datasContainer.children.length > 1) {
              datasContainer.removeChild(datasContainer.lastChild);
          }
          atualizarBotoesRemover();
      } else {
          alert("❌ Erro ao salvar no Drive: " + json.mensagem);
      }

  } catch (error) {
      console.error("Erro na requisição POST:", error);
      alert("❌ Ocorreu um erro ao comunicar com a planilha. Verifique sua conexão.");
  } finally {
      // Libera o botão novamente independente de dar certo ou errado
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = iconeOriginal;
      lucide.createIcons();
  }
}