console.log('script.js carregado!');
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
// Seleciona todos os cards de serviço
const cardsServico = document.querySelectorAll('.card-servico');

cardsServico.forEach(function (card) {
    card.addEventListener('click', function () {
        // Pega os dados guardados no card clicado
        const nome = card.dataset.nome;
        const preco = card.dataset.preco;

        // Salva esses dados na "gaveta" do navegador
        localStorage.setItem('servicoEscolhido', nome);
        localStorage.setItem('precoEscolhido', preco);

        // Navega para a página de calendário
        window.location.href = 'calendario.html';
    });
});
// Verifica se existe um título de serviço na página atual
const tituloServico = document.getElementById('titulo-servico');

// Só executa se esse elemento existir na página (evita erro em outras páginas)
if (tituloServico) {
    const nome = localStorage.getItem('servicoEscolhido');
    const preco = localStorage.getItem('precoEscolhido');

    if (nome && preco) {
        tituloServico.textContent = nome + ' · ' + preco;
    }
}