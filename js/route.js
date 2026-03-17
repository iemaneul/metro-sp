export function encontrarRota(grafo, origem, destino){

let fila = [[origem]]
let visitados = new Set()

while(fila.length){

let caminho = fila.shift()

let estacao = caminho[caminho.length-1]

if(estacao === destino){
return caminho
}

if(!visitados.has(estacao)){

visitados.add(estacao)

let vizinhos = grafo[estacao] || []

vizinhos.forEach(v=>{

fila.push([...caminho,v.destino])

})

}

}

return null

}