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
    const hash = window.location.hash || "#inicio";
    const secaoAtual = ["#camisetas", "#calcas", "#infantil"].includes(hash) ? "#catalogo" : hash;
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

    abrirMenu(false);
});
window.addEventListener("hashchange", marcarPagina);

marcarPagina();
