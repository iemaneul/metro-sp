import { supabase } from "./supabase.js"

export async function getLinhas(){

const { data } = await supabase
.from("linhas")
.select("*")
.order("numero")

return data

}

export async function getEstacoesDaLinha(linhaId){

const { data } = await supabase
.from("paradas_linha")
.select(`
ordem,
estacoes(*)
`)
.eq("linha_id", linhaId)
.order("ordem")

return data

}

export async function getParadasLinha(){

const { data } = await supabase
.from("paradas_linha")
.select(`
id,
linha_id,
estacao_id,
ordem,
nome_exibicao,
linhas(
id,
numero,
nome,
cor,
text_color
),
estacoes(
id,
nome
)
`)
.order("linha_id")
.order("ordem")

return data

}

export async function getTrechosLinha(){

const { data } = await supabase
.from("trechos_linha")
.select(`
linha_id,
parada_origem_id,
parada_destino_id,
tempo_segundos,
bidirecional
`)

return data

}

export async function getBaldeacoes(){

const { data } = await supabase
.from("baldeacoes")
.select(`
estacao_id,
parada_origem_id,
parada_destino_id,
tempo_segundos
`)

return data

}
