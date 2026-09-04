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

        const modal = document.getElementById('modal-confirmacao');
const modalTexto = document.getElementById('modal-texto');

modalTexto.textContent = 'Agendamento para ' + diaEscolhido.querySelector('.dia-nome').textContent + ' ' + diaEscolhido.querySelector('.dia-numero').textContent + ' às ' + horarioEscolhido.textContent + '.';

modal.classList.add('aberto');
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
const formLogin = document.getElementById('form-login');

if (formLogin) {
    formLogin.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const senha = document.getElementById('senha').value;
        const erroLogin = document.getElementById('erro-login');

        // Usuário e senha fixos, só para simulação
        const usuarioCorreto = 'barbeiro@abarbearia.com';
        const senhaCorreta = '123456';

        if (usuario === usuarioCorreto && senha === senhaCorreta) {
            window.location.href = 'painel.html';
        } else {
            erroLogin.textContent = 'Usuário ou senha incorretos.';
        }
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
        nome: "Cliente Elmont",
        iniciais: "JC",
        texto: "Atendimento excelente, ambiente muito bom e corte impecável. Dá pra perceber o cuidado em cada detalhe."
    },
    {
        nome: "Cliente Elmont",
        iniciais: "RM",
        texto: "Profissional muito atencioso e serviço de qualidade. Com certeza voltarei mais vezes."
    },
    {
        nome: "Cliente Elmont",
        iniciais: "LS",
        texto: "Ambiente diferenciado, ótimo atendimento e resultado acima do esperado."
    },
    {
        nome: "Cliente Elmont",
        iniciais: "MP",
        texto: "Uma experiência completa. Atendimento cuidadoso e acabamento impecável."
    },
    {
        nome: "Cliente Elmont",
        iniciais: "AF",
        texto: "Excelente atendimento, ambiente muito agradável e um corte feito com muita atenção aos detalhes."
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