import { getBaldeacoes, getEstacoesDaLinha, getParadasLinha, getTrechosLinha } from "./api.js"
import { criarGrafo } from "./graph.js"
import { encontrarRota } from "./route.js"
import { supabase } from "./supabase.js"

let estacoes = []
let grafo = {}
let paradas = []
let paradasPorId = {}
let paradasPorEstacao = {}
let estacoesOrdenadasPorLinha = {}
const ESTACOES_COMPARTILHADAS = {
"Paulista": ["Consolacao"],
"Consolacao": ["Paulista"]
}

async function init(){

await carregarEstacoes()
await carregarParadas()
await carregarGrafo()

if(document.getElementById("buscar")){
configurarTelaBusca()
}

if(document.getElementById("resultado")){
await carregarTelaResultado()
}

}

async function carregarEstacoes(){

const { data } = await supabase
.from("estacoes")
.select("*")
.order("nome")

estacoes = Array.isArray(data) ? data : []

const origem = document.getElementById("origem")
const destino = document.getElementById("destino")

if(!origem || !destino){
return
}

origem.innerHTML = ""
destino.innerHTML = ""

estacoes.forEach(estacao=>{
origem.innerHTML += `<option value="${estacao.id}">${estacao.nome}</option>`
destino.innerHTML += `<option value="${estacao.id}">${estacao.nome}</option>`
})

}

async function carregarParadas(){

const data = await getParadasLinha()

paradas = Array.isArray(data) ? data : []
paradasPorId = {}
paradasPorEstacao = {}

paradas.forEach(parada=>{

paradasPorId[parada.id] = parada

if(!paradasPorEstacao[parada.estacao_id]){
paradasPorEstacao[parada.estacao_id] = []
}

paradasPorEstacao[parada.estacao_id].push(parada)

})

}

async function carregarGrafo(){

const trechos = await getTrechosLinha()
const baldeacoes = await getBaldeacoes()
const conexoes = []

if(Array.isArray(trechos)){
trechos.forEach(trecho=>{
conexoes.push({
origem: trecho.parada_origem_id,
destino: trecho.parada_destino_id,
tempo: trecho.tempo_segundos,
tipo: "trecho",
linhaId: trecho.linha_id
})
})
}

if(Array.isArray(baldeacoes)){
baldeacoes.forEach(baldeacao=>{
conexoes.push({
origem: baldeacao.parada_origem_id,
destino: baldeacao.parada_destino_id,
tempo: baldeacao.tempo_segundos,
tipo: "baldeacao",
linhaId: null
})
})
}

grafo = criarGrafo(conexoes)

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

const origem = estacoes.find(estacao=>estacao.id === origemId)
const destino = estacoes.find(estacao=>estacao.id === destinoId)
const paradasOrigem = paradasPorEstacao[origemId] || []
const paradasDestino = paradasPorEstacao[destinoId] || []

if(!origem || !destino || paradasOrigem.length === 0 || paradasDestino.length === 0){
mostrarMensagem("Nao foi possivel localizar as estacoes informadas.")
return
}

document.getElementById("origem-nome").innerText = origem.nome
document.getElementById("destino-nome").innerText = destino.nome

const rota = encontrarRota(
grafo,
paradasOrigem.map(parada=>parada.id),
paradasDestino.map(parada=>parada.id)
)

if(!rota || rota.length === 0){
mostrarMensagem("Nenhuma rota encontrada para os parametros informados.")
return
}

await carregarEstacoesOrdenadasDasLinhas(rota)
mostrarResultado(rota)

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

function mostrarResultado(rota){

const cont = document.getElementById("resultado")
const segmentos = criarSegmentosDaRota(rota)
const tempoTotal = calcularTempoTotal(rota)

cont.innerHTML = `
<div class="resumo-percurso">
<p class="resumo-label">Percurso:</p>
<h2 class="resumo-titulo">${escapeHtml(nomeDaEstacaoDaParada(rota[0]))} -> ${escapeHtml(nomeDaEstacaoDaParada(rota[rota.length - 1]))}</h2>
</div>
<div class="segmentos-rota">
${segmentos.map(renderizarSegmento).join("")}
</div>
<p class="tempo-total">Media de tempo do trecho de ${formatarTempo(tempoTotal)}.</p>
`

}

function criarSegmentosDaRota(rota){

const segmentos = []
let segmentoAtual = null

rota.forEach(paradaId=>{

const parada = paradasPorId[paradaId]

if(!parada){
return
}

if(!segmentoAtual || segmentoAtual.linha?.id !== parada.linhas?.id){
segmentoAtual = {
linha: parada.linhas || null,
estacoes: []
}

segmentos.push(segmentoAtual)
}

const ultimaEstacaoId = segmentoAtual.estacoes[segmentoAtual.estacoes.length - 1]

if(ultimaEstacaoId !== parada.estacao_id){
segmentoAtual.estacoes.push(parada.estacao_id)
}

})

return segmentos.filter(segmento=>segmento.linha && segmento.estacoes.length > 0)

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

const paradasDaEstacao = paradasPorEstacao[estacaoId] || []
const tagsIntegracao = obterTagsDeEstacoesCompartilhadas(estacaoId, linhaAtual)
const bolinhas = paradasDaEstacao
.map(parada=>parada.linhas)
.filter((linha, index, lista)=>
linha &&
linha.numero !== linhaAtual?.numero &&
lista.findIndex(item=>item?.numero === linha.numero) === index
)
.map(linha=>`
<span
class="baldeacao-bolinha"
style="background-color: ${normalizarCor(linha.cor, "#0053A0")};"
title="Linha ${escapeHtml(linha.numero ?? "")}"
></span>
`).join("")

const mostrarLinhaAbaixo = indiceEstacao !== totalEstacoes - 1

return `
<div class="timeline-item">
<div class="timeline-marker">
<span class="timeline-ponto" style="border-color: ${corLinha};"></span>
${mostrarLinhaAbaixo ? `<span class="timeline-linha" style="background-color: ${corLinha};"></span>` : ""}
</div>
<div class="timeline-conteudo">
<p class="estacao-nome">${escapeHtml(nomeDaEstacao(estacaoId))}</p>
${tagsIntegracao}
${bolinhas ? `<div class="estacao-linhas">${bolinhas}</div>` : ""}
</div>
</div>
`

}

function nomeDaEstacao(estacaoId){

const estacao = estacoes.find(item=>item.id === estacaoId)

return estacao ? estacao.nome : String(estacaoId)

}

function nomeDaEstacaoDaParada(paradaId){

const parada = paradasPorId[paradaId]

return nomeDaEstacao(parada?.estacao_id)

}

function obterTagsDeEstacoesCompartilhadas(estacaoId, linhaAtual){

const nomeAtual = nomeDaEstacao(estacaoId)
const nomesCompartilhados = ESTACOES_COMPARTILHADAS[nomeAtual] || []

if(nomesCompartilhados.length === 0){
return ""
}

return nomesCompartilhados
.map(nomeCompartilhado=>{
const estacaoCompartilhada = estacoes.find(estacao=>estacao.nome === nomeCompartilhado)

if(!estacaoCompartilhada){
return ""
}

const linhasDaCompartilhada = (paradasPorEstacao[estacaoCompartilhada.id] || [])
.map(parada=>parada.linhas)
.filter((linha, index, lista)=>
linha &&
linha.numero !== linhaAtual?.numero &&
lista.findIndex(item=>item?.numero === linha.numero) === index
)

const corFundo = normalizarCor(linhasDaCompartilhada[0]?.cor, "#777777")
const corTexto = normalizarCor(linhasDaCompartilhada[0]?.text_color, "#FFFFFF")

return `<span class="estacao-compartilhada" style="background-color: ${corFundo}; border-color: ${corFundo}; color: ${corTexto};">${escapeHtml(nomeCompartilhado)}</span>`
})
.join("")

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
