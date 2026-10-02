const express = require("express");

const { obtenerEthereum } = require("../Services/rpcService");

const router = express.Router();


// ======================================================
// API INTERNA
// ======================================================

router.get("/api/rpc", async (req, res) => {

    let ethereum;


    // ==================================================
    // RPC - ETHEREUM
    // ==================================================

    try {

        console.log("");
        console.log("========================================");
        console.log("EJECUTANDO RPC - ETHEREUM");
        console.log("========================================");

        ethereum =
            await obtenerEthereum();

    }
    catch (error) {

        console.error(
            "Error Ethereum:",
            error.message
        );

        ethereum = {

            error: error.message

        };

    }


    // ==================================================
    // RESPUESTA
    // ==================================================

    res.json({

        ethereum

    });

});


module.exports = router;