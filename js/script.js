console.log('script.js carregado!');
// Seleciona todos os botões de dia que estão disponíveis
document.addEventListener("click", async function (evento) {

    const botao = evento.target.closest(".dia.disponivel");

    if (!botao) {
        return;
    }

    document
        .querySelectorAll(".dia.disponivel")
        .forEach(function (dia) {
            dia.classList.remove("selecionado");
        });

    botao.classList.add("selecionado");

    const dataSelecionada = botao.dataset.data;

    await carregarHorariosDisponiveis(dataSelecionada);
});
// Mesma lógica, mas para os botões de horário
// ========================================
// SELEÇÃO DE HORÁRIO
// ========================================

document.addEventListener("click", function (evento) {

    const botao = evento.target.closest(".horario");

    if (!botao) {
        return;
    }

    // Se estiver ocupado
    if (botao.classList.contains("indisponivel")) {
        alert("Esse horário já está reservado. Escolha outro horário.");
        return;
    }

    // Remove seleção anterior
    document.querySelectorAll(".horario").forEach(function (horario) {
        horario.classList.remove("selecionado");
    });

    // Seleciona o novo horário
    botao.classList.add("selecionado");
});
// Botões de tipo de bloqueio no painel
const opcoesBloqueio = document.querySelectorAll('.opcao-bloqueio');
const campoHorario = document.getElementById('campo-horario');

opcoesBloqueio.forEach(function (botao) {
    botao.addEventListener('click', function () {
        opcoesBloqueio.forEach(function (b) {
            b.classList.remove('ativo');
        });
        botao.classList.add('ativo');

        // Se o texto do botão for "Um horário", mostra o campo. Senão, esconde.
        if (campoHorario) {
            if (botao.textContent.trim() === 'Um horário') {
                campoHorario.style.display = 'flex';
            } else {
                campoHorario.style.display = 'none';
            }
        }
    });
});

// Seleciona todos os botões de remover bloqueio
const botoesRemover = document.querySelectorAll('.remover-bloqueio');

botoesRemover.forEach(function (botao) {
    botao.addEventListener('click', function () {
        // Encontra o "card" pai desse botão (o .item-bloqueio inteiro)
        const item = botao.closest('.item-bloqueio');

        // Remove esse elemento da página
        item.remove();
    });
});
// ========================================
// AGENDAMENTO COM SUPABASE
// ========================================

const botaoConfirmar = document.getElementById("botao-confirmar");
const modalCliente = document.getElementById("modal-cliente");
const modalConfirmacao = document.getElementById("modal-confirmacao");
const formCliente = document.getElementById("form-cliente");

function buscarClienteSalvo() {
    const clienteSalvo = localStorage.getItem("elmont_cliente");

    if (!clienteSalvo) {
        return null;
    }

    try {
        return JSON.parse(clienteSalvo);
    } catch {
        return null;
    }
}

if (botaoConfirmar) {
    botaoConfirmar.addEventListener("click", async function (evento) {
        evento.preventDefault();

        const diaEscolhido = document.querySelector(".dia.selecionado");
        const horarioEscolhido = document.querySelector(".horario.selecionado");

        if (!diaEscolhido) {
    alert("Escolha um dia antes de confirmar.");
    return;
}

        if (!horarioEscolhido) {
    alert("Escolha um horário disponível antes de confirmar.");
    return;
}

        const cliente = buscarClienteSalvo();

        if (cliente) {
            await salvarAgendamento(cliente);
            return;
        }

        modalCliente.classList.add("aberto");
    });
}

if (formCliente) {
    formCliente.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        const nome = document
            .getElementById("cliente-nome")
            .value
            .trim();

        const telefoneDigitado = document
            .getElementById("cliente-telefone")
            .value;

        const telefone = telefoneDigitado.replace(/\D/g, "");

        if (nome.length < 2) {
            alert("Informe seu nome.");
            return;
        }

        if (telefone.length < 10 || telefone.length > 13) {
            alert("Informe um número de WhatsApp válido.");
            return;
        }

        const cliente = {
            nome: nome,
            telefone: telefone
        };

        localStorage.setItem(
            "elmont_cliente",
            JSON.stringify(cliente)
        );

        modalCliente.classList.remove("aberto");

        await salvarAgendamento(cliente);
    });
}

async function salvarAgendamento(cliente) {
    const diaEscolhido = document.querySelector(".dia.selecionado");
    const horarioEscolhido = document.querySelector(".horario.selecionado");

    if (!diaEscolhido || !horarioEscolhido) {
        return;
    }

    const dataEscolhida = diaEscolhido.dataset.data;
    const horario = horarioEscolhido.textContent.trim();

    const parametrosAgendamento =
        new URLSearchParams(window.location.search);

    const nomeServico =
        parametrosAgendamento.get("servico");

    if (!nomeServico) {
        alert("Não foi possível identificar o serviço escolhido.");
        return;
    }

    // Procura o serviço no Supabase
    const {
        data: servico,
        error: erroServico
    } = await window.supabaseClient
        .from("servicos")
        .select("id")
        .eq("nome", nomeServico)
        .single();

    if (erroServico || !servico) {
        console.error(erroServico);

        alert("Não foi possível localizar o serviço.");

        return;
    }

    // Salva o agendamento
    const {
        error: erroAgendamento
    } = await window.supabaseClient
        .from("agendamentos")
        .insert({
            servico_id: servico.id,
            nome_cliente: cliente.nome,
            telefone: cliente.telefone,
            data: dataEscolhida,
            horario: horario
        });

    if (erroAgendamento) {
        console.error(erroAgendamento);

        if (erroAgendamento.code === "23505") {
            alert(
                "Esse horário acabou de ser reservado. Escolha outro horário."
            );
            return;
        }

        alert("Não foi possível realizar o agendamento.");
        return;
    }

    // Se deu tudo certo
    const modalTexto = document.getElementById("modal-texto");

    if (modalTexto) {
        modalTexto.textContent =
            `${cliente.nome}, seu agendamento de ${nomeServico} para ${horario} foi confirmado.`;
    }

    modalConfirmacao.classList.add("aberto");
}

const formBloqueio = document.getElementById('form-bloqueio');

if (formBloqueio) {
    formBloqueio.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const data = document.getElementById('data-bloqueio').value;
        const horario = document.getElementById('horario-bloqueio').value;
        const motivo = document.getElementById('motivo').value;

        const horarioVisivel = campoHorario && campoHorario.style.display !== 'none';

if (!data || (horarioVisivel && !horario)) {
    alert('Preencha os campos necessários.');
    return;
}

        // Cria um novo elemento <div> do zero
        const novoItem = document.createElement('div');
        novoItem.classList.add('item-bloqueio');

        // Monta o HTML de dentro desse novo elemento
        novoItem.innerHTML = `
            <p>${data} · ${horario} · <span class="motivo-bloqueio">"${motivo || 'sem motivo informado'}"</span></p>
            <button class="remover-bloqueio">✕ Remover</button>
        `;

        // Adiciona esse novo item no topo da lista
        const listaBloqueios = document.getElementById('bloqueios-ativos');
        listaBloqueios.insertBefore(novoItem, listaBloqueios.querySelector('h2').nextSibling);

        // Faz o botão de remover desse novo item funcionar também
        novoItem.querySelector('.remover-bloqueio').addEventListener('click', function () {
            novoItem.remove();
        });

        // Limpa o formulário depois de adicionar
        formBloqueio.reset();
    });
}
document.addEventListener('DOMContentLoaded', () => {
  const ritualBlocks = document.querySelectorAll('.ritual-block');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25
  };

  const ritualObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  ritualBlocks.forEach(block => {
    ritualObserver.observe(block);
  });
});
// ===== CARROSSEL DE AVALIAÇÕES =====

const reviews = [
    {
        nome: "Juan Carlos Soares",
        iniciais: "JC",
        texto: "O brabo de Goiânia! 💈🔥 Atendimento top, corte nos mínimos detalhes. O cara é especialista!"
    },
    {
        nome: "Jailson Oliveira",
        iniciais: "JO",
        texto: "Corte excelente, atendimento magnífico. Sou cliente há muitos anos, super recomendo. Cara é top."
    },
    {
        nome: "Arthur",
        iniciais: "AR",
        texto: "Excelente atendimento, cabelo ficou do jeito que eu queria."
    },
    {
        nome: "Allan Júnior",
        iniciais: "AJ",
        texto: "Barbearia top. Ambiente climatizado. Pontualidade. Ambiente agradável e estiloso. Vale a pena conhecer, sou cliente fiel."
    }
];

let reviewIndex = 0;

const reviewText = document.getElementById("review-text");
const reviewName = document.getElementById("review-name");
const reviewAvatar = document.getElementById("review-avatar");
const reviewCurrent = document.getElementById("review-current");
const reviewTotal = document.getElementById("review-total");

const reviewPrev = document.querySelector(".review-prev");
const reviewNext = document.querySelector(".review-next");
const reviewFeatured = document.querySelector(".review-featured");

if (
    reviewText &&
    reviewName &&
    reviewAvatar &&
    reviewCurrent &&
    reviewTotal &&
    reviewPrev &&
    reviewNext &&
    reviewFeatured
) {

    reviewTotal.textContent = String(reviews.length).padStart(2, "0");

    function atualizarReview() {
        reviewFeatured.classList.add("review-changing");

        setTimeout(() => {

            const review = reviews[reviewIndex];

            reviewText.textContent = review.texto;
            reviewName.textContent = review.nome;
            reviewAvatar.textContent = review.iniciais;

            reviewCurrent.textContent =
                String(reviewIndex + 1).padStart(2, "0");

            reviewFeatured.classList.remove("review-changing");

        }, 250);
    }

    reviewNext.addEventListener("click", () => {
        reviewIndex++;

        if (reviewIndex >= reviews.length) {
            reviewIndex = 0;
        }

        atualizarReview();
    });

    reviewPrev.addEventListener("click", () => {
        reviewIndex--;

        if (reviewIndex < 0) {
            reviewIndex = reviews.length - 1;
        }

        atualizarReview();
    });

}
// ===== MENU MOBILE =====

const menuToggle = document.querySelector(".menu-toggle");
const menuDireita = document.querySelector(".menu-direita");

if (menuToggle && menuDireita) {

    menuToggle.addEventListener("click", () => {
        menuDireita.classList.toggle("menu-aberto");
    });

    document.querySelectorAll(".menu-links a, .botao-menu").forEach(link => {

        link.addEventListener("click", () => {
            menuDireita.classList.remove("menu-aberto");
        });

    });

}
const cardsServico = document.querySelectorAll(".card-servico");

cardsServico.forEach((card) => {
    card.addEventListener("click", () => {
        const nome = card.dataset.nome;
        const preco = card.dataset.preco;

        window.location.href =
            `calendario.html?servico=${encodeURIComponent(nome)}&preco=${encodeURIComponent(preco)}`;
    });
});
const parametros = new URLSearchParams(window.location.search);

const servicoSelecionado = parametros.get("servico");
const precoSelecionado = parametros.get("preco");

const tituloServico = document.getElementById("titulo-servico");

if (tituloServico && servicoSelecionado && precoSelecionado) {
    tituloServico.textContent =
        `${servicoSelecionado} · ${precoSelecionado}`;
}
// ===== DATAS AUTOMÁTICAS DO AGENDAMENTO =====

const listaDias = document.getElementById("lista-dias");

if (listaDias) {

    const nomesDias = [
        "Dom",
        "Seg",
        "Ter",
        "Qua",
        "Qui",
        "Sex",
        "Sáb"
    ];

    const hoje = new Date();

    let diasAdicionados = 0;
    let contador = 0;

    // Quantos dias queremos mostrar
    const quantidadeDias = 6;

    while (diasAdicionados < quantidadeDias) {

        const data = new Date(hoje);

        data.setDate(hoje.getDate() + contador);

        contador++;

        // Domingo = 0
        // Não mostra domingo porque a barbearia está fechada
        if (data.getDay() === 0) {
            continue;
        }

        const botao = document.createElement("button");

        botao.classList.add("dia", "disponivel");

        botao.dataset.data = data.toISOString().split("T")[0];

        botao.innerHTML = `
            <span class="dia-nome">
                ${nomesDias[data.getDay()]}
            </span>

            <span class="dia-numero">
                ${String(data.getDate()).padStart(2, "0")}
            </span>
        `;

        listaDias.appendChild(botao);

        diasAdicionados++;
    }

}
async function carregarHorariosDisponiveis(dataSelecionada) {

    const botoes =
        document.querySelectorAll(".horario");

    // Primeiro libera todos novamente
    botoes.forEach(function (botao) {

        botao.disabled = false;

        botao.classList.remove(
            "indisponivel",
            "selecionado"
        );

        botao.classList.add("disponivel");
    });


    // Busca agendamentos já existentes
    const {
        data: agendamentos,
        error
    } = await window.supabaseClient
        .from("agendamentos")
        .select("horario")
        .eq("data", dataSelecionada)
        .eq("status", "confirmado");


    if (error) {

        console.error(
            "Erro ao consultar horários:",
            error
        );

        return;
    }


    agendamentos.forEach(function (agendamento) {

        const horarioOcupado =
            agendamento.horario.substring(0, 5);


        botoes.forEach(function (botao) {

            const horarioBotao =
                botao.textContent.trim();


            if (horarioBotao === horarioOcupado) {

                botao.classList.remove(
    "disponivel",
    "selecionado"
);

                botao.classList.add("indisponivel");

                botao.setAttribute("aria-disabled", "true");

                botao.dataset.status = "OCUPADO";
            }

        });

    });

}
// ===== VOLTAR DO PAINEL =====

const botaoVoltarPainel = document.getElementById("voltar-painel");

if (botaoVoltarPainel) {
    botaoVoltarPainel.addEventListener("click", function () {
        window.history.back();
    });
}