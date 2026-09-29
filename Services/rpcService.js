const PORT = 3000;

async function calcularPrecio(precioNoche, entrada, salida) {

    const url = `http://localhost:${PORT}/rpc`;

    const solicitudRPC = {

        jsonrpc: "2.0",

        method: "calcularPrecioReserva",

        params: {
            precioNoche: Number(precioNoche),
            entrada: entrada,
            salida: salida
        },

        id: 1

    };


    console.log("");
    console.log("========================================");
    console.log("RPC - CALCULAR PRECIO DE RESERVA");
    console.log("========================================");

    console.log("Solicitud:");
    console.log(
        JSON.stringify(
            solicitudRPC, 
            null, 
            2)
    );
    // --------------------------------------------------
    // LLAMADA RPC
    // --------------------------------------------------
 
    const respuesta = await fetch(url, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(
            solicitudRPC
        )

    });

    console.log(
        "HTTP Status RPC:", 
        respuesta.status
    );
    // --------------------------------------------------
    // VERIFICAR HTTP
    // --------------------------------------------------
 
    if (!respuesta.ok) {
        throw new Error(`Error HTTP RPC: 
            ${respuesta.status}`
        );
    }

    // --------------------------------------------------
    // CONVERTIR A JSON
    // --------------------------------------------------
 

    const datos = 
        await respuesta.json();

    console.log("Respuesta RPC:");

    console.log(JSON.stringify(
        datos, 
        null, 
        2)
    );

    // --------------------------------------------------
    // VERIFICAR ERROR JSON-RPC
    // --------------------------------------------------

    if (datos.error) {

        throw new Error(
            `RPC ${datos.error.code}: ${datos.error.message}`
        );
    }

    // --------------------------------------------------
    // DEVOLVER RESPUESTA
    // --------------------------------------------------

    return datos;
}
// ======================================================
// EXPORTAR
// ======================================================
 
module.exports = { 
    calcularPrecio 
};