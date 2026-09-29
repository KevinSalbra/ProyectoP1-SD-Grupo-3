const express = require("express");

const router = express.Router();

const reservas = require("../Services/reservasService");

router.get("/", async (req, res) => {

    const datos = await reservas.obtenerReservas();

    res.json(datos);

});

router.post("/", async (req, res) => {

    try {

        const nueva = await reservas.crearReserva(req.body);

        res.json(nueva);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});

router.put("/:id", async (req, res) => {

    try {

        const modificada = await reservas.modificarReserva(
            req.params.id,
            req.body
        );

        res.json(modificada);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});


router.delete("/:id", (req, res) => {

    try {

        const cancelada = reservas.cancelarReserva(req.params.id);

        res.json(cancelada);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});


module.exports = router;