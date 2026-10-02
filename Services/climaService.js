// ======================================================
// SERVICIO WEB - CLIMA DEL HOTEL (Semana 4)
// Basado en SISD-S4: services/graphqlService.js
// ======================================================


// ======================================================
// 1. COORDENADAS DEL HOTEL (Costa Rica, San José)
// Constantes al inicio, igual que COUNTRIES_API en
// graphqlService.js:10-11
// ======================================================

const LATITUD_HOTEL = 9.9281;

const LONGITUD_HOTEL = -84.0907;


// ======================================================
// 2. API DE CLIMA (Open-Meteo, gratuita y sin clave)
// URL fija: clima actual (temperatura, sensación térmica,
// humedad, viento) y temperatura máxima, mínima y lluvia
// diaria de los últimos 7 días más el día de hoy
// ======================================================

const CLIMA_API =
    `https://api.open-meteo.com/v1/forecast?latitude=${LATITUD_HOTEL}&longitude=${LONGITUD_HOTEL}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=7&forecast_days=1&timezone=America/Costa_Rica`;


// ======================================================
// FUNCIÓN 1
// Obtener el clima de los últimos días en el hotel
// Copia el patrón de graphqlService.js:27-90 (obtenerPaises),
// pero con GET a una URL fija (sin body ni headers)
// ======================================================

async function obtenerClima() {

    // ----------------------------------------------
    // LLAMADA HTTP GET A LA API DE CLIMA
    // (graphqlService.js:50-61, aquí sin POST)
    // ----------------------------------------------

    const respuesta = await fetch(CLIMA_API);


    // ----------------------------------------------
    // Convertir respuesta a JSON
    // (graphqlService.js:68)
    // ----------------------------------------------

    const resultado = await respuesta.json();


    // ----------------------------------------------
    // Verificar errores de la API
    // Open-Meteo responde { error: true, reason: "..." }
    // (equivale a graphqlService.js:75-82)
    // ----------------------------------------------

    if (resultado.error) {

        console.error(resultado.reason);

        throw new Error(
            "Error en la consulta del clima"
        );
    }


    // ----------------------------------------------
    // Retornar los datos tal cual los entrega la API
    // (graphqlService.js:89)
    // ----------------------------------------------

    return resultado;
}


// ======================================================
// EXPORTAR
// (graphqlService.js:171-174)
// ======================================================

module.exports = {
    obtenerClima
};
