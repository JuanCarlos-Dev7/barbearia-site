// Seleciona todos os botões de dia que estão disponíveis
const botoesDia = document.querySelectorAll('.dia.disponivel');

// Para cada botão de dia, escuta o evento de clique
botoesDia.forEach(function (botao) {
    botao.addEventListener('click', function () {
        // Remove a classe "selecionado" de todos os dias
        botoesDia.forEach(function (b) {
            b.classList.remove('selecionado');
        });
        // Adiciona a classe "selecionado" só no botão clicado
        botao.classList.add('selecionado');
    });
});
// Mesma lógica, mas para os botões de horário
const botoesHorario = document.querySelectorAll('.horario.disponivel');

botoesHorario.forEach(function (botao) {
    botao.addEventListener('click', function () {
        botoesHorario.forEach(function (b) {
            b.classList.remove('selecionado');
        });
        botao.classList.add('selecionado');
    });
});
// Botões de tipo de bloqueio no painel
const opcoesBloqueio = document.querySelectorAll('.opcao-bloqueio');

opcoesBloqueio.forEach(function (botao) {
    botao.addEventListener('click', function () {
        opcoesBloqueio.forEach(function (b) {
            b.classList.remove('ativo');
        });
        botao.classList.add('ativo');
    });
});