
const texto = document.getElementById("texto");
const seletorVoz = document.getElementById("voz");
const velocidade = document.getElementById("velocidade");
const volume = document.getElementById("volume");
const status = document.getElementById("status");

let vozes = [];
let tamanhoLetra = 20;

// CARREGAR VOZES DISPONÍVEIS

function carregarVozes() {

    vozes = speechSynthesis.getVoices();

    const portugues = vozes.filter(voz =>
        voz.lang.toLowerCase().startsWith("pt")
    );

    seletorVoz.innerHTML = "";

    if (portugues.length === 0) {
        const opcao = document.createElement("option");
        opcao.value = "";
        opcao.textContent = "Voz padrão do navegador";
        seletorVoz.appendChild(opcao);
        return;
    }

    portugues.forEach((voz, indice) => {

        const opcao = document.createElement("option");

        opcao.value = indice;
        opcao.textContent = voz.name + " (" + voz.lang + ")";

        seletorVoz.appendChild(opcao);

    });
}

speechSynthesis.onvoiceschanged = carregarVozes;
carregarVozes();

// TRANSFORMAR TEXTO EM VOZ

function falar() {

    const conteudo = texto.value.trim();

    if (!conteudo) {
        status.textContent = "Digite um texto primeiro.";
        texto.focus();
        return;
    }

    if (!("speechSynthesis" in window)) {
        status.textContent = "Seu navegador não suporta leitura de voz.";
        return;
    }

    speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(conteudo);

    fala.lang = "pt-BR";
    fala.rate = Number(velocidade.value);
    fala.volume = Number(volume.value);

    const portugues = vozes.filter(voz =>
        voz.lang.toLowerCase().startsWith("pt")
    );

    const vozSelecionada = portugues[Number(seletorVoz.value)];

    if (vozSelecionada) {
        fala.voice = vozSelecionada;
    }

    fala.onstart = () => {
        status.textContent = "🔊 Reproduzindo áudio...";
    };

    fala.onend = () => {
        status.textContent = "✅ Leitura finalizada!";
    };

    fala.onerror = () => {
        status.textContent = "Erro ao reproduzir o áudio.";
    };

    speechSynthesis.speak(fala);
}

// PAUSAR ÁUDIO

function pausar() {

    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
        status.textContent = "Áudio pausado.";
    }

}

// CONTINUAR ÁUDIO

function continuar() {

    if (speechSynthesis.paused) {
        speechSynthesis.resume();
        status.textContent = "Continuando a leitura...";
    }

}

// PARAR ÁUDIO

function parar() {

    speechSynthesis.cancel();
    status.textContent = "Áudio interrompido.";

}

// LIMPAR TEXTO

function limpar() {

    parar();
    texto.value = "";
    status.textContent = "Texto apagado.";
    texto.focus();

}

// VELOCIDADE

velocidade.addEventListener("input", () => {

    document.getElementById("valorVelocidade").textContent =
        velocidade.value + "x";

});

// VOLUME

volume.addEventListener("input", () => {

    document.getElementById("valorVolume").textContent =
        Math.round(volume.value * 100) + "%";

});

// AUMENTAR LETRAS

function aumentarLetra() {

    tamanhoLetra += 2;
    texto.style.fontSize = tamanhoLetra + "px";

}

// DIMINUIR LETRAS

function diminuirLetra() {

    tamanhoLetra = Math.max(12, tamanhoLetra - 2);
    texto.style.fontSize = tamanhoLetra + "px";

}

// ALTO CONTRASTE

function contraste() {

    document.body.classList.toggle("alto-contraste");

}

// CONECTAR BOTÕES

document.getElementById("btnFalar").addEventListener("click", falar);
document.getElementById("btnPausar").addEventListener("click", pausar);
document.getElementById("btnContinuar").addEventListener("click", continuar);
document.getElementById("btnParar").addEventListener("click", parar);
document.getElementById("btnLimpar").addEventListener("click", limpar);

document.getElementById("btnAumentar")
    .addEventListener("click", aumentarLetra);

document.getElementById("btnDiminuir")
    .addEventListener("click", diminuirLetra);

document.getElementById("btnContraste")
    .addEventListener("click", contraste);
