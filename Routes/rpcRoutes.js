const express = require("express");

const router = express.Router();

const { calcularPrecio } = require("../Services/rpcService");
const { calcularPrecioReserva } = require("../Services/calculoPrecioService");


router.get("/api/rpc/precio", async (req, res) => {

    try {

        const { precio, entrada, salida } = req.query;

        // Se hace la llamada RPC 
        const datos = await calcularPrecio(precio, entrada, salida);

        res.json(datos);

    } catch (error) {

        console.error("Error RPC:", error.message);

        res.status(500).json({ error: error.message });

    }

});


router.post("/rpc", (req, res) => {
    console.log("========== RPC RECIBIDO ==========");
    console.log("BODY:", req.body);
    console.log("METHOD:", req.body?.method);

    const { method, params, id } = req.body || {};

    if (method !== "calcularPrecioReserva") {

        return res.json({
            jsonrpc: "2.0",
            error: { code: -32601, message: "Método no encontrado" },
            id: id
        });

    }

    try {

        const resultado = calcularPrecioReserva(
            params.precioNoche,
            params.entrada,
            params.salida
        );

        res.json({ jsonrpc: "2.0", result: resultado, id: id });

    } catch (error) {

        res.json({
            jsonrpc: "2.0",
            error: { code: -32602, message: error.message },
            id: id
        });

    }

});


module.exports = router;