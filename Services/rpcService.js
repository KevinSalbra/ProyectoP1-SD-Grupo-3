// ======================================================
// SERVICIO RPC
// ======================================================


// ======================================================
// RPC #1 - ETHEREUM
// ======================================================

async function obtenerEthereum() {

    /*
     * Endpoint RPC de Ethereum
     *
     * IMPORTANTE:
     * Este endpoint puede cambiar dependiendo
     * de la disponibilidad del proveedor.
     */

    const url = "https://ethereum-rpc.publicnode.com";


    // --------------------------------------------------
    // MENSAJE JSON-RPC
    // --------------------------------------------------

    const solicitudRPC = {

        jsonrpc: "2.0",

        method: "eth_blockNumber",

        params: [],

        id: 1

    };


    console.log("");
    console.log("========================================");
    console.log("RPC #1 - ETHEREUM");
    console.log("========================================");

    console.log("Solicitud:");

    console.log(
        JSON.stringify(
            solicitudRPC,
            null,
            2
        )
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
        "HTTP Status Ethereum:",
        respuesta.status
    );


    // --------------------------------------------------
    // VERIFICAR HTTP
    // --------------------------------------------------

    if (!respuesta.ok) {

        throw new Error(
            `Error HTTP Ethereum: ${respuesta.status}`
        );

    }


    // --------------------------------------------------
    // CONVERTIR A JSON
    // --------------------------------------------------

    const datos =
        await respuesta.json();


    console.log("Respuesta Ethereum:");

    console.log(
        JSON.stringify(
            datos,
            null,
            2
        )
    );


    // --------------------------------------------------
    // VERIFICAR ERROR JSON-RPC
    // --------------------------------------------------

    if (datos.error) {

        throw new Error(
            `Ethereum RPC ${datos.error.code}: ${datos.error.message}`
        );

    }


    // --------------------------------------------------
    // DEVOLVER RESPUESTA
    // --------------------------------------------------

    return datos;

}


module.exports = {
    obtenerEthereum
};