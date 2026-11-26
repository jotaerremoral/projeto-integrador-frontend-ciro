/*
 * Tema: catálogo da Tornado Store.
 * Entrada: peças com nome, categoria e preço, mais os filtros e a seleção.
 * Processamento: classificar por categoria, filtrar e somar valores em centavos.
 * Saída: cards de produtos e resumos atualizados na página.
 */
const produtos = [
    { id: 1, nome: "Camiseta básica", categoria: "camisetas", preco: "4990", imagem: "camiseta-basica.svg", descricao: "Camiseta branca de gola redonda" },
    { id: 2, nome: "Camiseta Tornado", categoria: "camisetas", preco: "6990", imagem: "camiseta-tornado.svg", descricao: "Camiseta azul com desenho de vento" },
    { id: 3, nome: "Bermuda jeans", categoria: "calcas", preco: "9990", imagem: "bermuda-jeans.svg", descricao: "Bermuda jeans azul com bolsos" },
    { id: 4, nome: "Calça cargo", categoria: "calcas", preco: "12990", imagem: "calca-cargo.svg", descricao: "Calça cargo caqui com bolsos laterais" },
    { id: 5, nome: "Camiseta Aero infantil", categoria: "infantil", preco: "4490", imagem: "camiseta-infantil.svg", descricao: "Camiseta infantil verde com estampa de ondas" },
    { id: 6, nome: "Bermuda infantil", categoria: "infantil", preco: "5990", imagem: "bermuda-infantil.svg", descricao: "Bermuda infantil azul marinho com cordão claro" }
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

function processarCatalogo(lista) {
    let total = 0;
    for (const produto of lista) {
        total += Number(produto.preco);
    }

    const categorias = new Set();
    let indice = 0;
    while (indice < lista.length) {
        categorias.add(nomeCategoria(lista[indice].categoria));
        indice++;
    }

    return { total, categorias: categorias.size, quantidade: lista.length };
}

function formatarResumo(dados) {
    let resumo;
    if (dados.quantidade === 0) {
        resumo = "Nenhuma peça encontrada";
    } else if (dados.quantidade === 1) {
        resumo = "1 peça encontrada";
    } else {
        resumo = dados.quantidade + " peças em " + dados.categorias + " categorias";
    }
    return resumo + " · Valor do catálogo: " + moeda.format(dados.total / 100);
}

const dadosCatalogo = processarCatalogo(produtos);
document.querySelector("#resultado").textContent = formatarResumo(dadosCatalogo);
