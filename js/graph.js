export function criarGrafo(conexoes){

const grafo = {}

conexoes.forEach(conexao=>{

if(!grafo[conexao.origem]){
grafo[conexao.origem] = []
}

grafo[conexao.origem].push({
destino: conexao.destino,
tempo: conexao.tempo,
tipo: conexao.tipo,
linhaId: conexao.linhaId || null
})

})

return grafo

}
