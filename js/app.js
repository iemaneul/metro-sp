import { getConexoes, getEstacoesDaLinha, getLinhasDasEstacoes } from "./api.js"
import { criarGrafo } from "./graph.js"
import { encontrarRota } from "./route.js"
import { supabase } from "./supabase.js"

let estacoes = []
let grafo
let linhasPorEstacao = {}
let estacoesOrdenadasPorLinha = {}

async function init(){
await carregarEstacoes()
await carregarLinhasPorEstacao()

const conexoes = await getConexoes()
grafo = criarGrafo(conexoes)

if(document.getElementById("buscar")){
configurarTelaBusca()
}

if(document.getElementById("resultado")){
await carregarTelaResultado()
}

}

async function carregarLinhasPorEstacao(){

const data = await getLinhasDasEstacoes()

linhasPorEstacao = {}

if(!Array.isArray(data)){
return
}

data.forEach(item=>{

if(!linhasPorEstacao[item.estacao_id]){
linhasPorEstacao[item.estacao_id] = []
}

if(item.linhas){
linhasPorEstacao[item.estacao_id].push(item.linhas)
}

})

}

async function carregarEstacoes(){

const { data } = await supabase
.from("estacoes")
.select("*")
.order("nome")

estacoes = data

if(!Array.isArray(data)){
estacoes = []
return
}

const origem = document.getElementById("origem")
const destino = document.getElementById("destino")

if(!origem || !destino){
return
}

data.forEach(e=>{

origem.innerHTML += `<option value="${e.id}">${e.nome}</option>`
destino.innerHTML += `<option value="${e.id}">${e.nome}</option>`

})

}

function configurarTelaBusca(){

document
.getElementById("buscar")
.onclick = ()=>{

const origemId = parseInt(document.getElementById("origem").value)
const destinoId = parseInt(document.getElementById("destino").value)

const params = new URLSearchParams({
origem: origemId,
destino: destinoId
})

window.location.href = `./result.html?${params.toString()}`

}

document
.getElementById("invert")
.onclick = ()=>{

const origem = document.getElementById("origem")
const destino = document.getElementById("destino")

const temp = origem.value

origem.value = destino.value
destino.value = temp

}

}

async function carregarTelaResultado(){

const params = new URLSearchParams(window.location.search)
const origemId = parseInt(params.get("origem"))
const destinoId = parseInt(params.get("destino"))

if(!origemId || !destinoId){
mostrarMensagem("Informe origem e destino pela URL para ver a rota.")
return
}

const origem = estacoes.find(e=>e.id===origemId)
const destino = estacoes.find(e=>e.id===destinoId)

if(!origem || !destino){
mostrarMensagem("Nao foi possivel localizar as estacoes informadas.")
return
}

document.getElementById("origem-nome").innerText = origem.nome
document.getElementById("destino-nome").innerText = destino.nome

const rota = encontrarRota(grafo, origemId, destinoId)

if(!rota || rota.length === 0){
mostrarMensagem("Nenhuma rota encontrada para os parametros informados.")
return
}

await carregarEstacoesOrdenadasDasLinhas(rota)

mostrarResultado(rota)

const voltar = document.getElementById("voltar")

if(voltar){
voltar.onclick = ()=>{
window.location.href = "./routes.html"
}
}

}

function mostrarResultado(rota){

const cont = document.getElementById("resultado")
const segmentos = criarSegmentosDaRota(rota)
const tempoTotal = calcularTempoTotal(rota)

cont.innerHTML = `
<div class="resumo-percurso">
<p class="resumo-label">Percurso:</p>
<h2 class="resumo-titulo">${escapeHtml(nomeDaEstacao(rota[0]))} -> ${escapeHtml(nomeDaEstacao(rota[rota.length - 1]))}</h2>
</div>
<div class="segmentos-rota">
${segmentos.map(renderizarSegmento).join("")}
</div>
<p class="tempo-total">Media de tempo do trecho de ${formatarTempo(tempoTotal)}.</p>
`

}

async function carregarEstacoesOrdenadasDasLinhas(rota){

const segmentos = criarSegmentosDaRota(rota)
const linhasIds = [...new Set(
segmentos
.map(segmento=>segmento.linha?.id)
.filter(Boolean)
)]

for(const linhaId of linhasIds){
if(estacoesOrdenadasPorLinha[linhaId]){
continue
}

const data = await getEstacoesDaLinha(linhaId)

estacoesOrdenadasPorLinha[linhaId] = Array.isArray(data)
? data.map(item=>item.estacoes?.id).filter(Boolean)
: []
}

}

function criarSegmentosDaRota(rota){

if(rota.length === 0){
return []
}

if(rota.length === 1){
return [{
linha: linhasPorEstacao[rota[0]]?.[0] || null,
estacoes: [rota[0]]
}]
}

const linhasPorTrecho = []

for(let i = 0; i < rota.length - 1; i += 1){
const linhasEmComum = obterLinhasEmComum(
linhasPorEstacao[rota[i]] || [],
linhasPorEstacao[rota[i + 1]] || []
)

linhasPorTrecho.push(linhasEmComum)
}

const segmentos = []
let linhaAtual = escolherLinhaDoTrecho(linhasPorTrecho, 0, null)
let estacoesDoSegmento = [rota[0]]

for(let i = 0; i < linhasPorTrecho.length; i += 1){
const opcoes = linhasPorTrecho[i]
const proximaLinha = escolherLinhaDoTrecho(linhasPorTrecho, i, linhaAtual)

if(
linhaAtual &&
proximaLinha &&
proximaLinha.numero !== linhaAtual.numero &&
estacoesDoSegmento.length > 0
){
estacoesDoSegmento.push(rota[i])

segmentos.push({
linha: linhaAtual,
estacoes: [...new Set(estacoesDoSegmento)]
})

estacoesDoSegmento = [rota[i]]
}

linhaAtual = proximaLinha || linhaAtual || opcoes[0] || null
estacoesDoSegmento.push(rota[i + 1])
}

segmentos.push({
linha: linhaAtual,
estacoes: [...new Set(estacoesDoSegmento)]
})

return segmentos.filter(segmento=>segmento.estacoes.length > 0)

}

function escolherLinhaDoTrecho(linhasPorTrecho, index, linhaPreferida){

const opcoes = linhasPorTrecho[index] || []

if(opcoes.length === 0){
return null
}

if(
linhaPreferida &&
opcoes.some(opcao=>opcao.numero === linhaPreferida.numero)
){
return linhaPreferida
}

let melhorLinha = opcoes[0]
let maiorSequencia = -1

opcoes.forEach(opcao=>{

let sequencia = 0

for(let i = index; i < linhasPorTrecho.length; i += 1){
const existe = (linhasPorTrecho[i] || []).some(linha=>linha.numero === opcao.numero)

if(!existe){
break
}

sequencia += 1
}

if(sequencia > maiorSequencia){
maiorSequencia = sequencia
melhorLinha = opcao
}

})

return melhorLinha

}

function adicionarLinhasEmComum(destino, linhasA, linhasB){

linhasA.forEach(linhaA=>{

const existeNaOutra = linhasB.some(linhaB=>linhaB.numero === linhaA.numero)
const jaFoiAdicionada = destino.some(linha=>linha.numero === linhaA.numero)

if(existeNaOutra && !jaFoiAdicionada){
destino.push(linhaA)
}

})

}

function obterLinhasEmComum(linhasA, linhasB){

const linhasEmComum = []

adicionarLinhasEmComum(linhasEmComum, linhasA, linhasB)

return linhasEmComum

}

function renderizarSegmento(segmento, indiceSegmento, segmentos){

const linha = segmento.linha
const corLinha = normalizarCor(linha?.cor, "#0053A0")
const corTexto = normalizarCor(linha?.text_color, "#FFFFFF")
const transferirPara = segmentos[indiceSegmento + 1]?.linha || null

return `
<section class="segmento-linha">
<div class="segmento-topo">
<span class="linha-badge linha-badge-principal" style="background-color: ${corLinha}; color: ${corTexto};">
${escapeHtml(linha?.numero ?? "?")}
</span>
<h3 class="segmento-titulo">${escapeHtml(nomeDoSentidoDoSegmento(segmento))}</h3>
</div>
<div class="timeline">
${segmento.estacoes.map((estacaoId, indiceEstacao)=>renderizarEstacaoDoSegmento(
estacaoId,
indiceEstacao,
segmento.estacoes.length,
corLinha,
linha,
transferirPara,
indiceEstacao === segmento.estacoes.length - 1
)).join("")}
</div>
</section>
`

}

function nomeDoSentidoDoSegmento(segmento){

const linhaId = segmento.linha?.id
const estacoesDaLinha = estacoesOrdenadasPorLinha[linhaId] || []
const primeiraEstacaoDoSegmento = segmento.estacoes[0]
const ultimaEstacaoDoSegmento = segmento.estacoes[segmento.estacoes.length - 1]

const indiceInicial = estacoesDaLinha.indexOf(primeiraEstacaoDoSegmento)
const indiceFinal = estacoesDaLinha.indexOf(ultimaEstacaoDoSegmento)

if(indiceInicial !== -1 && indiceFinal !== -1){
const terminalInicialId = indiceInicial <= indiceFinal
? estacoesDaLinha[0]
: estacoesDaLinha[estacoesDaLinha.length - 1]
const terminalFinalId = indiceInicial <= indiceFinal
? estacoesDaLinha[estacoesDaLinha.length - 1]
: estacoesDaLinha[0]

return `${nomeDaEstacao(terminalInicialId)} - ${nomeDaEstacao(terminalFinalId)}`
}

return nomeDaEstacao(ultimaEstacaoDoSegmento)

}

function renderizarEstacaoDoSegmento(estacaoId, indiceEstacao, totalEstacoes, corLinha, linhaAtual, proximaLinha, ultimaEstacao){

const linhasDaEstacao = linhasPorEstacao[estacaoId] || []
const bolinhas = ultimaEstacao && proximaLinha
? linhasDaEstacao
.filter(linha=>linha.numero !== linhaAtual?.numero)
.map(linha=>`
<span
class="baldeacao-bolinha"
style="background-color: ${normalizarCor(linha.cor, "#0053A0")};"
title="Linha ${escapeHtml(linha.numero ?? "")}"
></span>
`).join("")
: ""

const mostrarLinhaAbaixo = indiceEstacao !== totalEstacoes - 1

return `
<div class="timeline-item">
<div class="timeline-marker">
<span class="timeline-ponto" style="border-color: ${corLinha};"></span>
${mostrarLinhaAbaixo ? `<span class="timeline-linha" style="background-color: ${corLinha};"></span>` : ""}
</div>
<div class="timeline-conteudo">
<p class="estacao-nome">${escapeHtml(nomeDaEstacao(estacaoId))}</p>
${bolinhas ? `<div class="estacao-linhas">${bolinhas}</div>` : ""}
</div>
</div>
`

}

function nomeDaEstacao(estacaoId){

const estacao = estacoes.find(item=>item.id === estacaoId)

return estacao ? estacao.nome : String(estacaoId)

}

function nomeDaLinha(linha){

if(!linha){
return "Linha"
}

return linha.nome || `Linha ${linha.numero}`

}

function calcularTempoTotal(rota){

let totalSegundos = 0

for(let i = 0; i < rota.length - 1; i += 1){
const origemId = rota[i]
const destinoId = rota[i + 1]
const conexao = (grafo[origemId] || []).find(item=>item.destino === destinoId)

if(conexao?.tempo){
totalSegundos += Number(conexao.tempo)
}
}

return totalSegundos

}

function formatarTempo(totalSegundos){

if(!totalSegundos){
return "0 minutos"
}

const minutos = Math.round(totalSegundos / 60)

if(minutos === 1){
return "1 minuto"
}

return `${minutos} minutos`

}

function mostrarMensagem(texto){

const cont = document.getElementById("resultado")

if(cont){
cont.innerHTML = `<p class="mensagem-resultado">${texto}</p>`
}

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

init()
