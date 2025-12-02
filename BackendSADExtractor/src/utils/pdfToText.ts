import pdf from "@cedrugs/pdf-parse";

export async function decodeBase64PdfToText(base64: string): Promise<string> {
  // Se vier com prefixo "data:application/pdf;base64,..." remove
  const cleaned = base64.replace(/^data:application\/pdf;base64,/, "");

  // Converte base64 -> Buffer binário do PDF
  const pdfBuffer = Buffer.from(cleaned, "base64");

  // Extrai o texto do PDF
  const data = await pdf(pdfBuffer);
  // data.text contém todo o texto extraído do PDF
  return data.text;
}
