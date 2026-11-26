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

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function nomeCategoria(codigo) {
    switch (codigo) {
        case "camisetas": return "Camisetas";
        case "calcas": return "Calças e bermudas";
        case "infantil": return "Infantil";
        default: return "Outras peças";
    }
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
    dados.append(
        criarElemento("span", "categoria", nomeCategoria(produto.categoria)),
        criarElemento("h3", "", produto.nome),
        criarElemento("p", "preco", moeda.format(produto.preco / 100))
    );
    card.append(foto, dados);
    return card;
}

function mostrarProdutos(categoria = "todas") {
    const visiveis = produtos.filter((produto) => categoria === "todas" || produto.categoria === categoria);
    const total = visiveis.reduce((soma, produto) => soma + produto.preco, 0);
    document.querySelector("#produtos").replaceChildren(...visiveis.map(criarCard));
    document.querySelector("#resultado").textContent =
        visiveis.length + " peças · Valor do catálogo: " + moeda.format(total / 100);
}

mostrarProdutos();
