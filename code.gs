/**
 * Google Apps Script — recibe los resultados del quiz y los guarda en Google Sheets.
 *
 * PASOS (igual que en el Taller C2):
 *  1. Crea una hoja de cálculo en Google Sheets.
 *  2. Extensiones > Apps Script y pega este código.
 *  3. Pega abajo el ID de tu hoja (la cadena entre /d/ y /edit en la URL).
 *  4. Guardar > Implementar > Nueva implementación > Aplicación web.
 *       - Ejecutar como: yo
 *       - Quién tiene acceso: Cualquier persona
 *  5. Autoriza los permisos y copia la URL de la implementación.
 *  6. Pega esa URL en app.js, en CONFIG.APPS_SCRIPT_URL.
 */

const SHEET_ID = "PEGAR_AQUI_EL_ID_DE_LA_HOJA";
const SHEET_NAME = "Resultados";

const ENCABEZADOS = [
  "Fecha", "Participante", "Puntaje", "Total", "Porcentaje", "Para repasar", "Duración (s)"
];

// Evita que Sheets interprete el texto como fórmula.
function limpiar(valor) {
  const s = String(valor == null ? "" : valor);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    const libro = SpreadsheetApp.openById(SHEET_ID);
    const hoja = libro.getSheetByName(SHEET_NAME) || libro.insertSheet(SHEET_NAME);

    if (hoja.getLastRow() === 0) hoja.appendRow(ENCABEZADOS);

    hoja.appendRow([
      new Date(),
      limpiar(datos.participante).slice(0, 60),
      Number(datos.puntaje) || 0,
      Number(datos.total) || 0,
      Number(datos.porcentaje) || 0,
      limpiar((datos.falladas || []).join("; ")),
      Number(datos.duracion_s) || 0
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Útil para comprobar en el navegador que la implementación está activa.
function doGet() {
  return ContentService.createTextOutput("Servicio activo");
}
