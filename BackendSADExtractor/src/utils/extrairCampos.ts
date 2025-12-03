import OpenAI from "openai";
import { AI_API_KEY } from "../lib/env.js";

const client = new OpenAI({
  apiKey: AI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export type CamposLaudo = {
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidadeMunicipio: string | null;

  confrontanteFrente: string | null;
  confrontanteFundo: string | null;
  confrontanteLateralDireita: string | null;
  confrontanteLateralEsquerda: string | null;

  coordenadaS: string | null;
  coordenadaW: string | null;

  tipoImovel: string | null;
  areaTerreno: string | null;
  areaConstruida: string | null;
  unidadeMedida: string | null;
  estadoConservacao: string | null;

  dataValoracao: string | null;

  numeroDocumento: string | null;

  valorConstrucaoNova: string | null;
  valorAreaConstruida: string | null;
  valorTerreno: string | null;

  confiabilidade: string;
};

export async function extrairCamposComIA(
  textoLaudo: string,
): Promise<CamposLaudo> {
  const response = await client.chat.completions.create({
    model: "tngtech/deepseek-r1t-chimera:free",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: [
          "Você é uma IA especializada em leitura de laudos de avaliação imobiliária.",
          "Sua tarefa é ler o texto integral de um laudo e Extrair campos estruturados.",
          "Retorne APENAS um JSON válido, sem explicações, comentários ou texto extra.",
          "Se um campo não estiver claramente presente no laudo, use null para esse campo.",
          "Números devem ser retornados como strings",
          "Datas devem ser retornadas como string no formato ISO AAAA-MM-DD quando possível.",
        ].join(" "),
      },
      {
        role: "user",
        content: `
Texto do laudo:
"""
${textoLaudo}
"""

Sua tarefa é identificar e extrair, a partir do texto acima, os seguintes campos de um laudo de avaliação de imóvel:

- endereco: logradouro do imóvel (ex.: "Rua Marques do Pombal")
- numero: número do imóvel (ex.: "455")
- bairro: bairro (ex.: "Santo Amaro")
- cidadeMunicipio: cidade/município + UF (ex.: "Recife/PE")

- confrontanteFrente: confrontante da frente do imóvel
- confrontanteFundo: confrontante de fundo
- confrontanteLateralDireita: confrontante lateral direita
- confrontanteLateralEsquerda: confrontante lateral esquerda

- coordenadaS: coordenada geográfica em graus/minutos/segundos ao sul (ex.: "8°02'56.4\"S")
- coordenadaW: coordenada geográfica em graus/minutos/segundos a oeste (ex.: "34°52'57.8\"W")

- tipoImovel: tipo do imóvel (ex.: "Edificio", "Casa", "Terreno")
- areaTerreno: área total do terreno em metros quadrados (número, ex.: 4152.68)
- areaConstruida: área construída em metros quadrados (número, ex.: 2210.42)
- unidadeMedida: unidade de medida usada para as áreas (ex.: "Metro quadrado")
- estadoConservacao: estado de conservação do imóvel (ex.: "Regular", "Bom", "Ruim")

- dataValoracao: data da valoração do imóvel em ISO (AAAA-MM-DD) se possível
- numeroDocumento: número/código do laudo ou documento (ex.: "LA 067/2025-P SUARE/SAD")

- valorConstrucaoNova: valor da construção nova, em moeda (número, ex.: 5133911.91)
- valorAreaConstruida: valor da área construída (número)
- valorTerreno: valor do terreno (número)

Além disso, calcule um campo:
- confiabilidade: número entre 0 e 1 indicando o quão confiante você está na extração desses campos com base no texto fornecido. Será exporto como porcentagem (ex.: 0.85 para 85% de confiança).

IMPORTANTE:
- Se não encontrar um campo de forma clara, use null para esse campo.
- Retorne EXATAMENTE um JSON com o seguinte formato (sem comentários, sem campos extras):

{
  "endereco": string | null,
  "numero": string | null,
  "bairro": string | null,
  "cidadeMunicipio": string | null,
  "confrontanteFrente": string | null,
  "confrontanteFundo": string | null,
  "confrontanteLateralDireita": string | null,
  "confrontanteLateralEsquerda": string | null,
  "coordenadaS": string | null,
  "coordenadaW": string | null,
  "tipoImovel": string | null,
  "areaTerreno": string | null,
  "areaConstruida": string | null,
  "unidadeMedida": string | null,
  "estadoConservacao": string | null,
  "dataValoracao": string | null,
  "numeroDocumento": string | null,
  "valorConstrucaoNova": string | null,
  "valorAreaConstruida": string | null,
  "valorTerreno": string | null,
  "confiabilidade": string
}
        `,
      },
    ],
    response_format: { type: "json_object" as const },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const json = typeof raw === "string" ? JSON.parse(raw) : raw;

  return {
    endereco: json.endereco ?? null,
    numero: json.numero ?? null,
    bairro: json.bairro ?? null,
    cidadeMunicipio: json.cidadeMunicipio ?? null,

    confrontanteFrente: json.confrontanteFrente ?? null,
    confrontanteFundo: json.confrontanteFundo ?? null,
    confrontanteLateralDireita: json.confrontanteLateralDireita ?? null,
    confrontanteLateralEsquerda: json.confrontanteLateralEsquerda ?? null,

    coordenadaS: json.coordenadaS ?? null,
    coordenadaW: json.coordenadaW ?? null,

    tipoImovel: json.tipoImovel ?? null,
    areaTerreno: json.areaTerreno ?? null,
    areaConstruida: json.areaConstruida ?? null,
    unidadeMedida: json.unidadeMedida ?? null,
    estadoConservacao: json.estadoConservacao ?? null,

    dataValoracao: json.dataValoracao ?? null,
    numeroDocumento: json.numeroDocumento ?? null,

    valorConstrucaoNova: json.valorConstrucaoNova ?? null,
    valorAreaConstruida: json.valorAreaConstruida ?? null,
    valorTerreno: json.valorTerreno ?? null,

    confiabilidade: json.confiabilidade ?? 0,
  };
}
