import { getConexoes } from "./api.js"
import { criarGrafo } from "./graph.js"
import { encontrarRota } from "./route.js"
import { supabase } from "./supabase.js"

let estacoes = []
let grafo

async function init(){

await carregarEstacoes()

const conexoes = await getConexoes()

grafo = criarGrafo(conexoes)

}

async function carregarEstacoes(){

const { data } = await supabase
.from("estacoes")
.select("*")
.order("nome")

estacoes = data

const origem = document.getElementById("origem")
const destino = document.getElementById("destino")

data.forEach(e=>{

origem.innerHTML += `<option value="${e.id}">${e.nome}</option>`
destino.innerHTML += `<option value="${e.id}">${e.nome}</option>`

})

}

document
.getElementById("buscar")
.onclick = ()=>{

const origemId = parseInt(document.getElementById("origem").value)
const destinoId = parseInt(document.getElementById("destino").value)

const origemNome = estacoes.find(e=>e.id===origemId).nome
const destinoNome = estacoes.find(e=>e.id===destinoId).nome

document.getElementById("origem-nome").innerText = origemNome
document.getElementById("destino-nome").innerText = destinoNome

const rota = encontrarRota(grafo, origemId, destinoId)

mostrarResultado(rota)

trocarTela("tela-resultado")

}

function mostrarResultado(rota){

const cont = document.getElementById("resultado")

cont.innerHTML = ""

rota.forEach(id=>{

const estacao = estacoes.find(e=>e.id===id)

cont.innerHTML += `
<div class="estacao">
${estacao ? estacao.nome : id}
</div>
`

})

}

document
.getElementById("voltar")
.onclick = ()=>{

trocarTela("tela-busca")

}

function trocarTela(id){

document
.querySelectorAll("section")
.forEach(s=>s.classList.add("hidden"))

document
.getElementById(id)
.classList.remove("hidden")

}

init()

document
.getElementById("invert")
.onclick = ()=>{

const origem = document.getElementById("origem")
const destino = document.getElementById("destino")

const temp = origem.value

origem.value = destino.value
destino.value = temp

}