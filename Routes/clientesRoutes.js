const express = require("express");

const router = express.Router();

const clientes = require("../Services/clientesService");


router.get("/", async (req, res) => {

    const datos = await clientes.obtenerClientes();

    res.json(datos);

});


router.post("/", (req, res) => {

    try {

        const nuevo = clientes.registrarCliente(req.body);

        res.json(nuevo);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});


module.exports = router;