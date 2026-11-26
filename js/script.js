/*
 * Tema: catálogo da Tornado Store.
 * Entrada: peças com nome, categoria e preço, mais os filtros e a seleção.
 * Processamento: classificar por categoria, filtrar e somar valores em centavos.
 * Saída: cards de produtos e resumos atualizados na página.
 */
const produtos = [
    { id: 1, nome: "Camiseta básica", categoria: "camisetas", preco: 4990, imagem: "camiseta-basica.svg", descricao: "Camiseta branca de gola redonda" },
    { id: 2, nome: "Camiseta Tornado", categoria: "camisetas", preco: 6990, imagem: "camiseta-tornado.svg", descricao: "Camiseta azul com desenho de vento" },
    { id: 3, nome: "Bermuda jeans", categoria: "calcas", preco: 9990, imagem: "bermuda-jeans.svg", descricao: "Bermuda jeans azul com bolsos" },
    { id: 4, nome: "Calça cargo", categoria: "calcas", preco: 12990, imagem: "calca-cargo.svg", descricao: "Calça cargo caqui com bolsos laterais" },
    { id: 5, nome: "Camiseta Aero infantil", categoria: "infantil", preco: 4490, imagem: "camiseta-infantil.svg", descricao: "Camiseta infantil verde com estampa de ondas" },
    { id: 6, nome: "Bermuda infantil", categoria: "infantil", preco: 5990, imagem: "bermuda-infantil.svg", descricao: "Bermuda infantil azul marinho com cordão claro" }
];

const listaProdutos = document.querySelector("#produtos");
const listaSelecao = document.querySelector("#lista-selecao");
const busca = document.querySelector("#busca");
const categoria = document.querySelector("#categoria");
const botaoLimpar = document.querySelector("#limpar");
const selecionados = new Set();
const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function nomeCategoria(codigo) {
    switch (codigo) {
        case "camisetas": return "Camisetas";
        case "calcas": return "Calças e bermudas";
        case "infantil": return "Infantil";
        default: return "Outras peças";
    }
}

function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function filtrarProdutos() {
    const termo = normalizar(busca.value);
    return produtos.filter((produto) => {
        const corresponde = normalizar(produto.nome).includes(termo);
        const pertence = categoria.value === "todas" || categoria.value === produto.categoria;
        return corresponde && pertence;
    });
}

function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto) elemento.textContent = texto;
    return elemento;
}

function criarCard(produto) {
    const card = criarElemento("li", "produto");
    const foto = criarElemento("div", "foto");
    const imagem = criarElemento("img");
    imagem.src = "assets/images/" + produto.imagem;
    imagem.alt = produto.descricao;
    imagem.width = 320;
    imagem.height = 260;
    foto.append(imagem);

    const dados = criarElemento("div", "produto-dados");
    const botao = criarElemento("button", "botao botao-contorno", "Selecionar");
    botao.type = "button";
    botao.dataset.produto = produto.id;
    botao.setAttribute("aria-label", "Selecionar " + produto.nome);
    botao.setAttribute("aria-pressed", String(selecionados.has(produto.id)));
    dados.append(
        criarElemento("span", "categoria", nomeCategoria(produto.categoria)),
        criarElemento("h3", "", produto.nome),
        criarElemento("p", "preco", moeda.format(produto.preco / 100)),
        botao
    );
    card.append(foto, dados);
    return card;
}

function mostrarProdutos() {
    const visiveis = filtrarProdutos();
    listaProdutos.replaceChildren(...visiveis.map(criarCard));
    const contagem = document.querySelector("#resultado");

    if (visiveis.length === 0) {
        contagem.textContent = "Nenhuma peça encontrada. Tente outra busca ou categoria.";
    } else if (visiveis.length === 1) {
        contagem.textContent = "1 peça encontrada";
    } else {
        contagem.textContent = visiveis.length + " peças encontradas";
    }
}

function atualizarSelecao() {
    const itens = produtos.filter((produto) => selecionados.has(produto.id));
    const total = itens.reduce((soma, produto) => soma + produto.preco, 0);
    document.querySelector("#resumo").textContent =
        itens.length + (itens.length === 1 ? " peça" : " peças") + " · Total " + moeda.format(total / 100);
    document.querySelector("#quantidade-nav").textContent = itens.length;
    botaoLimpar.disabled = itens.length === 0;

    // Limpa as linhas da seleção anterior antes de exibir as atuais.
    while (listaSelecao.firstChild) listaSelecao.firstChild.remove();
    const linhas = document.createDocumentFragment();
    for (const produto of itens) {
        linhas.append(criarElemento("li", "", produto.nome + " · " + moeda.format(produto.preco / 100)));
    }

    listaSelecao.append(linhas);

    for (const botao of listaProdutos.querySelectorAll("button[data-produto]")) {
        botao.setAttribute("aria-pressed", String(selecionados.has(Number(botao.dataset.produto))));
    }
}

// Um listener no contêiner atende também os novos cards renderizados pelos filtros.
listaProdutos.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-produto]");
    if (!botao) return;

    const id = Number(botao.dataset.produto);
    if (selecionados.has(id)) {
        selecionados.delete(id);
    } else {
        selecionados.add(id);
    }
    atualizarSelecao();
});

busca.addEventListener("input", mostrarProdutos);
categoria.addEventListener("change", mostrarProdutos);
botaoLimpar.addEventListener("click", () => {
    selecionados.clear();
    document.querySelector("#titulo-selecao").focus();
    atualizarSelecao();
});

const menu = document.querySelector("#menu");
const botaoMenu = document.querySelector("#menu-botao");

function abrirMenu(aberto) {
    menu.classList.toggle("aberto", aberto);
    botaoMenu.setAttribute("aria-expanded", String(aberto));
}

botaoMenu.addEventListener("click", () => abrirMenu(!menu.classList.contains("aberto")));
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && menu.classList.contains("aberto")) {
        abrirMenu(false);
        botaoMenu.focus();
    }
});

function marcarPagina() {
    const secaoAtual = window.location.hash || "#inicio";
    for (const link of menu.querySelectorAll(":scope > li > a")) {
        const ativo = link.getAttribute("href") === secaoAtual;
        link.classList.toggle("ativo", ativo);
        if (ativo) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    }
}

menu.addEventListener("click", (evento) => {
    const link = evento.target.closest("a");
    if (!link) return;

    if (link.dataset.categoria) {
        busca.value = "";
        categoria.value = link.dataset.categoria;
        mostrarProdutos();
    }
    abrirMenu(false);
});
window.addEventListener("hashchange", marcarPagina);

document.querySelector("#form-contato").addEventListener("submit", (evento) => {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const nome = formulario.elements.nome.value.trim();
    const mensagem = formulario.elements.mensagem.value.trim();
    const retorno = document.querySelector("#retorno-contato");

    if (!nome || !mensagem) {
        retorno.textContent = "Preencha o nome e a mensagem antes de continuar.";
        formulario.elements[nome ? "mensagem" : "nome"].focus();
        return;
    }

    retorno.textContent = "Obrigado, " + nome + "! O formulário foi validado. Nenhuma mensagem foi enviada.";
    formulario.reset();
});

marcarPagina();
mostrarProdutos();
atualizarSelecao();
