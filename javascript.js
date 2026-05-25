let passo = 0;

function mudar() {

    var imagem = document.getElementById("img-header"); 

    if (passo == 0) {
        imagem.src = "img/adidas vs nike.png";
        passo = 1;
    } else if (passo == 1) {
        imagem.src = "img/puma header.png";
        passo = 0;
    } 
}

let contando = 0;

function passar() {

    var img = document.getElementById("img-header");

    if (contando == 0) {
        img.src = "img/puma header.png";
        contando = 1;
    } else if (contando == 1) {
        img.src = "img/adidas vs nike.png";
        contando = 0;
    } 
}

// 1. Seleção única
const campoPesquisa = document.getElementById('SearchPesquisa');
const cardsTenis = document.querySelectorAll('.tenis-card');
const botoesFiltro = document.querySelectorAll('.filter-btn');

// 2. Função de clique nos botões
botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
        
        // Pegando os valores dos botões
        const minP = botao.getAttribute('data-min');
        const maxP = botao.getAttribute('data-max');
        const minT = botao.getAttribute('data-t-min');
        const maxT = botao.getAttribute('data-t-max'); // Use o nome novo aqui

        cardsTenis.forEach(card => {
            const precoCard = parseFloat(card.getAttribute('data-preco'));
            const tamanhoCard = parseFloat(card.getAttribute('data-tamanho'));
            let exibir = false;

            // Se o botão clicado for de PREÇO (ele tem data-min)
            if (minP !== null) {
                if (precoCard >= parseFloat(minP) && precoCard <= parseFloat(maxP)) {
                    exibir = true;
                }
            } 
            // Se o botão clicado for de TAMANHO (ele tem data-t-min)
            else if (minT !== null) {
                if (tamanhoCard >= parseFloat(minT) && tamanhoCard <= parseFloat(maxT)) {
                    exibir = true;
                }
            }

            // Aplicando o resultado
            card.style.display = exibir ? "block" : "none";
        });
    });
});

// 3. Sua busca (mantive como você fez, que estava boa)
campoPesquisa.addEventListener('input', () => {
    const termo = campoPesquisa.value.toLowerCase();
    cardsTenis.forEach(card => {
        const nome = card.querySelector('h4').innerText.toLowerCase();
        const precoTexto = card.querySelector('p').innerText.toLowerCase();
        
        if (nome.includes(termo) || precoTexto.includes(termo)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});
// Função para abrir o modal específico
function abrir(idModal) {
    const m = document.getElementById(idModal);
    if (m) {
        m.showModal();
    }
}

// Função para fechar o modal específico
function fechar(idModal) {
    const m = document.getElementById(idModal);
    if (m) {
        m.close();
    }
}