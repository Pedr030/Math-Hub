/**
 * Cores da paleta `brand` (ver tailwind.config.js) em formato RGB,
 * para uso com jsPDF — que não entende hex/Tailwind, só r,g,b separados.
 *
 * Mantém os relatórios PDF visualmente alinhados com a identidade do
 * Hub sem precisar decifrar tuplas soltas no meio da lógica de exportação.
 */
export const PDF_CORES = {
  brand400: [56, 135, 194],   // #3887C2 — azul claro (destaques, valores)
  brand500: [45, 113, 168],   // #2D71A8 — azul médio
  brand800: [21, 62, 108],    // #153E6C — navy (títulos)
  slate400: [148, 163, 184],  // texto terciário (rodapé, marca d'água)
  slate500: [100, 116, 139],  // texto secundário (rótulos)
  slate900: [15, 23, 42],     // texto principal (títulos/corpo)
};