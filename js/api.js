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
.from("linha_estacoes")
.select(`
ordem,
estacoes(*)
`)
.eq("linha_id",linhaId)
.order("ordem")

return data

}

export async function getConexoes(){

const { data } = await supabase
.from("conexoes_estacoes")
.select("*")

return data

}

export async function getLinhasDasEstacoes(){

const { data } = await supabase
.from("linha_estacoes")
.select(`
estacao_id,
linhas(
id,
nome,
numero,
cor,
text_color
)
`)
.order("linha_id")

return data

}
