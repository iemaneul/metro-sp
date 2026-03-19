import { getEstacoesDaLinha, getLinhas, getParadasLinha } from "./api.js"

const listaLinhas = document.getElementById("lista-linhas")
const linhaDetalhe = document.getElementById("linha-detalhe")

init()

async function init(){

if(listaLinhas){
await carregarListaDeLinhas()
}

if(linhaDetalhe){
await carregarDetalheDaLinha()
}

}

async function carregarListaDeLinhas(){

const linhas = await getLinhas()
const lista = Array.isArray(linhas) ? [...linhas].sort(ordenarLinhasPorNumero) : []

if(lista.length === 0){
listaLinhas.innerHTML = `<p class="mensagem-lista">Nenhuma linha encontrada no momento.</p>`
return
}

listaLinhas.innerHTML = lista
.map(linha=>renderizarCardDaLinha(linha))
.join("")

}

async function carregarDetalheDaLinha(){

const params = new URLSearchParams(window.location.search)
const linhaId = Number(params.get("id"))

if(!linhaId){
linhaDetalhe.innerHTML = `<p class="mensagem-lista">Informe uma linha valida para ver os detalhes.</p>`
return
}

const linhas = await getLinhas()
const linha = (Array.isArray(linhas) ? linhas : []).find(item=>item.id === linhaId)

if(!linha){
linhaDetalhe.innerHTML = `<p class="mensagem-lista">Nao foi possivel localizar a linha informada.</p>`
return
}

const estacoesData = await getEstacoesDaLinha(linhaId)
const paradasData = await getParadasLinha()
const estacoes = Array.isArray(estacoesData) ? estacoesData : []
const paradasPorEstacao = agruparParadasPorEstacao(paradasData)
const corLinha = normalizarCor(linha.cor, "#0053A0")
const corTexto = normalizarCor(linha.text_color, "#FFFFFF")

linhaDetalhe.innerHTML = `
<div class="linha-detalhe-topo">
<span class="linha-badge-detalhe" style="background-color: ${corLinha}; color: ${corTexto};">${escapeHtml(linha.numero)}</span>
<div class="linha-detalhe-cabecalho">
<h2>${escapeHtml(linha.nome)}</h2>
<p class="linha-detalhe-operadora">${escapeHtml(nomeDaOperadora(linha))}</p>
</div>
</div>

<div class="estacoes-bloco">
<p class="estacoes-bloco-titulo">Estações em ordem</p>
<div class="estacoes-ordenadas">
${estacoes.length > 0
? estacoes.map((item, index)=>renderizarEstacaoOrdenada(item, index, estacoes.length, corLinha, linha, paradasPorEstacao)).join("")
: `<p class="mensagem-lista">Nenhuma estacao cadastrada para essa linha.</p>`
}
</div>
</div>
`

}

function renderizarCardDaLinha(linha){

const corLinha = normalizarCor(linha.cor, "#0053A0")
const corTexto = normalizarCor(linha.text_color, "#FFFFFF")

return `
<a class="linha-card" href="./line-detail.html?id=${linha.id}">
<div class="linha-card-topo">
<div class="linha-card-principal">
<span class="linha-badge-detalhe" style="background-color: ${corLinha}; color: ${corTexto};">${escapeHtml(linha.numero)}</span>
<h3>${escapeHtml(linha.nome)}</h3>
</div>
<div class="d-flex fd-row ai-center gap-10">
<span class="linha-operadora-tag">${escapeHtml(nomeDaOperadora(linha))}</span>
<span class="arrow-detail">></span>
</div>
</div>
</a>
`

}

function renderizarEstacaoOrdenada(item, indice, total, corLinha, linhaAtual, paradasPorEstacao){

const estacaoId = item.estacoes?.id
const nome = item.estacoes?.nome || "Estacao sem nome"
const mostrarLinha = indice !== total - 1
const baldeacoes = obterBaldeacoesDaEstacao(estacaoId, linhaAtual, paradasPorEstacao)

return `
<div class="estacao-ordenada-item">
<div class="estacao-ordenada-marcador">
<span class="estacao-ordenada-ponto" style="border-color: ${corLinha};"></span>
${mostrarLinha ? `<span class="estacao-ordenada-linha" style="background-color: ${corLinha};"></span>` : ""}
</div>
<div class="estacao-ordenada-conteudo">
<span class="estacao-ordem">${indice + 1}</span>
<div class="estacao-ordenada-info">
<p>${escapeHtml(nome)}</p>
${baldeacoes}
</div>
</div>
</div>
`

}

function obterBaldeacoesDaEstacao(estacaoId, linhaAtual, paradasPorEstacao){

const paradas = paradasPorEstacao[estacaoId] || []
const linhasConectadas = paradas
.map(parada=>parada.linhas)
.filter((linha, index, lista)=>
linha &&
linha.numero !== linhaAtual?.numero &&
lista.findIndex(item=>item?.numero === linha.numero) === index
)

if(linhasConectadas.length === 0){
return ""
}

const bolinhas = linhasConectadas
.map(linha=>`
<span
class="baldeacao-bolinha"
style="background-color: ${normalizarCor(linha.cor, "#0053A0")};"
title="Linha ${escapeHtml(linha.numero ?? "")}"
></span>
`).join("")

return `
<div class="estacao-linhas">
${bolinhas}
</div>
`

}

function agruparParadasPorEstacao(paradasData){

const paradas = Array.isArray(paradasData) ? paradasData : []

return paradas.reduce((acc, parada)=>{
if(!acc[parada.estacao_id]){
acc[parada.estacao_id] = []
}

acc[parada.estacao_id].push(parada)
return acc
}, {})

}

function nomeDaOperadora(linha){

if(linha?.operadora){
return linha.operadora
}

if(["1", "2", "3", "4", "5", "15"].includes(String(linha?.numero))){
return "Metro"
}

if(["7", "8", "9", "10", "11", "12", "13"].includes(String(linha?.numero))){
return "CPTM"
}

return "Sistema metropolitano"

}

function ordenarLinhasPorNumero(a, b){

const numeroA = Number.parseInt(a?.numero, 10)
const numeroB = Number.parseInt(b?.numero, 10)

if(Number.isNaN(numeroA) && Number.isNaN(numeroB)){
return String(a?.numero || "").localeCompare(String(b?.numero || ""), "pt-BR")
}

if(Number.isNaN(numeroA)){
return 1
}

if(Number.isNaN(numeroB)){
return -1
}

return numeroA - numeroB

}

function normalizarCor(cor, fallback){

if(typeof cor !== "string"){
return fallback
}

const corLimpa = cor.trim()

if(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(corLimpa)){
return corLimpa
}

return fallback

}

function escapeHtml(valor){

return String(valor)
.replaceAll("&","&amp;")
.replaceAll("<","&lt;")
.replaceAll(">","&gt;")
.replaceAll('"',"&quot;")
.replaceAll("'","&#39;")

}
