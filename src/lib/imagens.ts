// Reduz a foto enviada antes de guardar, para caber no armazenamento do navegador.
// Na versão real, a foto vai direto para o armazenamento de arquivos (Cloudflare R2).

export async function reduzirImagem(arquivo: File, ladoMaximo = 640): Promise<string> {
  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, ladoMaximo / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export const ehImagemEnviada = (foto: string) => foto.startsWith("data:");
