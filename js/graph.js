export function criarGrafo(conexoes){

const grafo = {}

conexoes.forEach(c=>{

if(!grafo[c.estacao_origem]){
grafo[c.estacao_origem] = []
}

grafo[c.estacao_origem].push({

destino:c.estacao_destino,
tempo:c.tempo_segundos

})

})

return grafo

}