console.log("Painel Elmont carregado!");

let graficoFaturamento = null;


// ========================================
// PROTEGER PAINEL
// ========================================

async function protegerPainel() {

    const {
        data: { session }
    } = await window.supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


// ========================================
// LOGOUT
// ========================================

const btnLogout =
    document.getElementById("btn-logout");

if (btnLogout) {

    btnLogout.addEventListener(
        "click",
        async function () {

            await window.supabaseClient.auth.signOut();

            window.location.href = "login.html";
        }
    );
}


// ========================================
// DATAS
// ========================================

function formatarDataBanco(data) {

    const ano =
        data.getFullYear();

    const mes =
        String(data.getMonth() + 1)
            .padStart(2, "0");

    const dia =
        String(data.getDate())
            .padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


function obterPeriodo(tipo) {

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    let inicio;
    let fim;

    let inicioAnterior;
    let fimAnterior;


    // ========================================
    // HOJE
    // ========================================

    if (tipo === "hoje") {

        inicio = new Date(hoje);
        fim = new Date(hoje);

        inicioAnterior =
            new Date(hoje);

        inicioAnterior.setDate(
            inicioAnterior.getDate() - 1
        );

        fimAnterior =
            new Date(inicioAnterior);
    }


    // ========================================
    // SEMANA
    // ========================================

    else if (tipo === "semana") {

        const diaSemana =
            hoje.getDay();

        const diferenca =
            diaSemana === 0
                ? -6
                : 1 - diaSemana;


        inicio =
            new Date(hoje);

        inicio.setDate(
            hoje.getDate() + diferenca
        );


        fim =
            new Date(inicio);

        fim.setDate(
            inicio.getDate() + 6
        );


        inicioAnterior =
            new Date(inicio);

        inicioAnterior.setDate(
            inicio.getDate() - 7
        );


        fimAnterior =
            new Date(fim);

        fimAnterior.setDate(
            fim.getDate() - 7
        );
    }


    // ========================================
    // MÊS
    // ========================================

    else if (tipo === "mes") {

        inicio =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                1
            );


        fim =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth() + 1,
                0
            );


        inicioAnterior =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth() - 1,
                1
            );


        fimAnterior =
            new Date(
                hoje.getFullYear(),
                hoje.getMonth(),
                0
            );
    }


    // ========================================
    // ANO
    // ========================================

    else {

        inicio =
            new Date(
                hoje.getFullYear(),
                0,
                1
            );


        fim =
            new Date(
                hoje.getFullYear(),
                11,
                31
            );


        inicioAnterior =
            new Date(
                hoje.getFullYear() - 1,
                0,
                1
            );


        fimAnterior =
            new Date(
                hoje.getFullYear() - 1,
                11,
                31
            );
    }


    return {

        inicio:
            formatarDataBanco(inicio),

        fim:
            formatarDataBanco(fim),

        inicioAnterior:
            formatarDataBanco(
                inicioAnterior
            ),

        fimAnterior:
            formatarDataBanco(
                fimAnterior
            )
    };
}


// ========================================
// BUSCAR AGENDAMENTOS
// ========================================

async function buscarAgendamentos(
    inicio,
    fim
) {

    const {
        data,
        error
    } = await window.supabaseClient

        .from("agendamentos")

        .select(`
            id,
            nome_cliente,
            telefone,
            data,
            horario,
            status,
            valor_cobrado,
            forma_pagamento,
            servicos (
                nome,
                preco
            )
        `)

        .gte("data", inicio)

        .lte("data", fim)

        .order("data")

        .order("horario");


    if (error) {

        console.error(
            "Erro ao buscar agendamentos:",
            error
        );

        return [];
    }


    return data || [];
}


// ========================================
// SERVIÇO DO AGENDAMENTO
// ========================================

function obterServico(agendamento) {

    if (!agendamento.servicos) {
        return null;
    }


    if (
        Array.isArray(
            agendamento.servicos
        )
    ) {

        return (
            agendamento.servicos[0]
            || null
        );
    }


    return agendamento.servicos;
}


// ========================================
// VALOR DO ATENDIMENTO
// ========================================

function obterValorAgendamento(
    agendamento
) {

    if (
        agendamento.valor_cobrado
        !== null
        &&
        agendamento.valor_cobrado
        !== undefined
    ) {

        return Number(
            agendamento.valor_cobrado
        );
    }


    const servico =
        obterServico(agendamento);


    if (!servico) {
        return 0;
    }


    return Number(
        servico.preco || 0
    );
}


// ========================================
// DINHEIRO
// ========================================

function moeda(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
}


// ========================================
// ATUALIZAR DASHBOARD
// ========================================

async function carregarDashboard() {

    const filtro =
        document.getElementById(
            "filtro-periodo"
        );

    const periodoSelecionado =
        filtro
            ? filtro.value
            : "semana";


    const periodo =
        obterPeriodo(
            periodoSelecionado
        );


    const agendamentos =
        await buscarAgendamentos(
            periodo.inicio,
            periodo.fim
        );


    const agendamentosAnteriores =
        await buscarAgendamentos(
            periodo.inicioAnterior,
            periodo.fimAnterior
        );


    // Só atendimento concluído
    // entra nas estatísticas financeiras.

    const concluidos =
        agendamentos.filter(
            (agendamento) =>
                agendamento.status
                === "concluido"
        );


    const concluidosAnteriores =
        agendamentosAnteriores.filter(
            (agendamento) =>
                agendamento.status
                === "concluido"
        );


    // ========================================
    // FATURAMENTO
    // ========================================

    const faturamento =
        concluidos.reduce(
            (total, agendamento) => {

                return (
                    total
                    +
                    obterValorAgendamento(
                        agendamento
                    )
                );

            },
            0
        );


    const faturamentoAnterior =
        concluidosAnteriores.reduce(
            (total, agendamento) => {

                return (
                    total
                    +
                    obterValorAgendamento(
                        agendamento
                    )
                );

            },
            0
        );


    // ========================================
    // ATENDIMENTOS
    // ========================================

    const totalAtendimentos =
        concluidos.length;


    // ========================================
    // TICKET MÉDIO
    // ========================================

    const ticketMedio =
        totalAtendimentos > 0

            ? faturamento
                / totalAtendimentos

            : 0;


    // ========================================
    // CLIENTES ÚNICOS
    // ========================================

    const clientes =
        new Set(
            concluidos.map(
                (agendamento) =>
                    agendamento.telefone
            )
        );


    // ========================================
    // ATUALIZAR CARDS
    // ========================================

    document.getElementById(
        "valor-faturamento"
    ).textContent =
        moeda(faturamento);


    document.getElementById(
        "total-atendimentos"
    ).textContent =
        totalAtendimentos;


    document.getElementById(
        "ticket-medio"
    ).textContent =
        moeda(ticketMedio);


    document.getElementById(
        "total-clientes"
    ).textContent =
        clientes.size;


    atualizarComparacao(
        faturamento,
        faturamentoAnterior
    );


    atualizarGrafico(
        concluidos,
        periodoSelecionado
    );


    atualizarRanking(
        concluidos
    );


    await carregarAgendaHoje();
}


// ========================================
// COMPARAÇÃO COM PERÍODO ANTERIOR
// ========================================

function atualizarComparacao(
    atual,
    anterior
) {

    const elemento =
        document.getElementById(
            "comparacao-faturamento"
        );


    if (!elemento) {
        return;
    }


    elemento.classList.remove(
        "positivo",
        "negativo"
    );


    if (
        anterior === 0
        &&
        atual === 0
    ) {

        elemento.textContent =
            "Sem faturamento no período";

        return;
    }


    if (
        anterior === 0
        &&
        atual > 0
    ) {

        elemento.textContent =
            "Novo faturamento no período";

        elemento.classList.add(
            "positivo"
        );

        return;
    }


    const diferenca =
        (
            (atual - anterior)
            /
            anterior
        )
        * 100;


    if (diferenca >= 0) {

        elemento.textContent =
            `+${diferenca.toFixed(1)}% vs. período anterior`;

        elemento.classList.add(
            "positivo"
        );

    } else {

        elemento.textContent =
            `${diferenca.toFixed(1)}% vs. período anterior`;

        elemento.classList.add(
            "negativo"
        );
    }
}


// ========================================
// GRÁFICO
// ========================================

function atualizarGrafico(
    concluidos,
    periodo
) {

    const canvas =
        document.getElementById(
            "grafico-faturamento"
        );


    if (!canvas) {
        return;
    }


    const valoresPorData = {};


    concluidos.forEach(
        (agendamento) => {

            let chave =
                agendamento.data;


            if (periodo === "ano") {

                chave =
                    agendamento.data
                        .substring(0, 7);
            }


            if (!valoresPorData[chave]) {

                valoresPorData[chave] = 0;
            }


            valoresPorData[chave] +=
                obterValorAgendamento(
                    agendamento
                );
        }
    );


    const labels =
        Object.keys(
            valoresPorData
        );


    const valores =
        Object.values(
            valoresPorData
        );


    if (graficoFaturamento) {

        graficoFaturamento.destroy();
    }


    graficoFaturamento =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [
                        {

                            label:
                                "Faturamento",

                            data:
                                valores,

                            borderColor:
                                "#c9a227",

                            backgroundColor:
                                "rgba(201,162,39,0.12)",

                            fill: true,

                            tension: 0.35,

                            pointBackgroundColor:
                                "#c9a227"
                        }
                    ]
                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        }

                    },

                    scales: {

                        x: {

                            ticks: {
                                color: "#8f8b85"
                            },

                            grid: {
                                color:
                                    "rgba(255,255,255,0.04)"
                            }
                        },

                        y: {

                            beginAtZero: true,

                            ticks: {

                                color: "#8f8b85",

                                callback:
                                    function (valor) {

                                        return (
                                            "R$ "
                                            + valor
                                        );
                                    }
                            },

                            grid: {
                                color:
                                    "rgba(255,255,255,0.05)"
                            }
                        }

                    }

                }

            }
        );
}


// ========================================
// RANKING DE SERVIÇOS
// ========================================

function atualizarRanking(
    concluidos
) {

    const container =
        document.getElementById(
            "ranking-servicos"
        );


    if (!container) {
        return;
    }


    const ranking = {};


    concluidos.forEach(
        (agendamento) => {

            const servico =
                obterServico(
                    agendamento
                );


            if (!servico) {
                return;
            }


            if (!ranking[servico.nome]) {

                ranking[servico.nome] = 0;
            }


            ranking[servico.nome]++;
        }
    );


    const lista =
        Object.entries(ranking)

            .sort(
                (a, b) =>
                    b[1] - a[1]
            )

            .slice(0, 5);


    if (lista.length === 0) {

        container.innerHTML = `
            <p class="painel-vazio">
                Ainda não há atendimentos concluídos.
            </p>
        `;

        return;
    }


    container.innerHTML =
        lista.map(
            ([nome, quantidade], indice) => {

                return `

                    <div class="ranking-item">

                        <span class="ranking-posicao">
                            ${indice + 1}
                        </span>

                        <span class="ranking-nome">
                            ${nome}
                        </span>

                        <strong>
                            ${quantidade}
                        </strong>

                    </div>

                `;
            }
        )
        .join("");
}


// ========================================
// AGENDA DE HOJE
// ========================================

async function carregarAgendaHoje() {

    const hoje =
        formatarDataBanco(
            new Date()
        );


    const agendamentos =
        await buscarAgendamentos(
            hoje,
            hoje
        );


    const agenda =
        agendamentos.filter(
            (agendamento) =>
                agendamento.status
                === "confirmado"
        );


    const container =
        document.getElementById(
            "agenda-hoje"
        );


    if (!container) {
        return;
    }


    if (agenda.length === 0) {

        container.innerHTML = `
            <p class="painel-vazio">
                Nenhum atendimento agendado para hoje.
            </p>
        `;

        return;
    }


    container.innerHTML =
        agenda.map(
            (agendamento) => {

                const servico =
                    obterServico(
                        agendamento
                    );


                const horario =
                    agendamento.horario
                        .substring(0, 5);


                return `

                    <div class="agenda-item">

                        <div>

                            <strong>
                                ${horario}
                            </strong>

                            <span>
                                ${agendamento.nome_cliente}
                            </span>

                        </div>

                        <small>
                            ${
                                servico
                                    ? servico.nome
                                    : "Serviço"
                            }
                        </small>

                    </div>

                `;
            }
        )
        .join("");
}


// ========================================
// FILTRO
// ========================================

const filtroPeriodo =
    document.getElementById(
        "filtro-periodo"
    );


if (filtroPeriodo) {

    filtroPeriodo.addEventListener(
        "change",
        carregarDashboard
    );
}


// ========================================
// INICIAR PAINEL
// ========================================

async function iniciarPainel() {

    const autorizado =
        await protegerPainel();


    if (!autorizado) {
        return;
    }


    await carregarDashboard();
}


iniciarPainel();