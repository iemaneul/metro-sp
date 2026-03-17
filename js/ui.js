import { state } from "./state.js"

export function mostrarTela(id){

state.telaAtual = id

document
.querySelectorAll("section")
.forEach(s => s.classList.add("hidden"))

document
.getElementById(id)
.classList.remove("hidden")

const btn = document.getElementById("btn-voltar")

if(id === "tela-home"){
btn.classList.add("hidden")
}else{
btn.classList.remove("hidden")
}

const origemInfo = document.getElementById("origem-info-topo")

if(origemInfo){

if(
id === "tela-linha-destino" ||
id === "tela-estacao-destino"
){
origemInfo.classList.remove("hidden")
}else{
origemInfo.classList.add("hidden")
}

}

}