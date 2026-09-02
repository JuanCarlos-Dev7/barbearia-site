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
const botaoConfirmar = document.getElementById('botao-confirmar');

if (botaoConfirmar) {
    botaoConfirmar.addEventListener('click', function (evento) {
        evento.preventDefault();

        const diaEscolhido = document.querySelector('.dia.selecionado');
        const horarioEscolhido = document.querySelector('.horario.selecionado');

        if (!diaEscolhido || !horarioEscolhido) {
            alert('Escolha um dia e um horário antes de confirmar.');
            return;
        }

        alert('Agendamento confirmado para ' + diaEscolhido.querySelector('.dia-nome').textContent + ' ' + diaEscolhido.querySelector('.dia-numero').textContent + ' às ' + horarioEscolhido.textContent + '!');
    });
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