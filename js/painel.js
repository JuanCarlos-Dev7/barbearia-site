console.log("Painel Elmont carregado!");

const canvasGrafico =
    document.getElementById("grafico-faturamento");

if (canvasGrafico) {

    new Chart(canvasGrafico, {

        type: "line",

        data: {

            labels: [
                "Seg",
                "Ter",
                "Qua",
                "Qui",
                "Sex",
                "Sáb"
            ],

            datasets: [
                {
                    label: "Faturamento",

                    data: [
                        250,
                        430,
                        320,
                        610,
                        780,
                        920
                    ],

                    tension: 0.35
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

                y: {

                    beginAtZero: true,

                    ticks: {

                        callback: function (valor) {
                            return "R$ " + valor;
                        }

                    }

                }

            }

        }

    });

}