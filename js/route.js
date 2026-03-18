export function encontrarRota(grafo, origens, destinos){

const origensLista = Array.isArray(origens) ? origens : [origens]
const destinosLista = Array.isArray(destinos) ? destinos : [destinos]
const destinosSet = new Set(destinosLista)
const distancias = new Map()
const anteriores = new Map()
const visitados = new Set()
const fila = []

origensLista.forEach(origem=>{
distancias.set(origem, 0)
fila.push({
no: origem,
distancia: 0
})
})

while(fila.length){

fila.sort((a, b)=>a.distancia - b.distancia)

const atual = fila.shift()

if(!atual || visitados.has(atual.no)){
continue
}

visitados.add(atual.no)

if(destinosSet.has(atual.no)){
return reconstruirCaminho(anteriores, atual.no)
}

const vizinhos = grafo[atual.no] || []

vizinhos.forEach(vizinho=>{

const novaDistancia = atual.distancia + Number(vizinho.tempo || 0)
const distanciaAtual = distancias.get(vizinho.destino)

if(distanciaAtual === undefined || novaDistancia < distanciaAtual){
distancias.set(vizinho.destino, novaDistancia)
anteriores.set(vizinho.destino, atual.no)
fila.push({
no: vizinho.destino,
distancia: novaDistancia
})
}

})

}

return null

}

function reconstruirCaminho(anteriores, destino){

const caminho = [destino]
let atual = destino

while(anteriores.has(atual)){
atual = anteriores.get(atual)
caminho.unshift(atual)
}

return caminho

}
