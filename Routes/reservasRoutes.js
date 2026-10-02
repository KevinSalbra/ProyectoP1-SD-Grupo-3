const express = require("express");

const router = express.Router();

const reservas = require("../Services/reservasService");


// ======================================================
// GET - CONSULTAR RESERVAS
// ======================================================

router.get("/", async (req, res) => {

    const datos = await reservas.obtenerReservas();

    res.json(datos);

});


// ======================================================
// GET - CALCULAR PRECIO
// /api/reservas/precio?habitacion=201&entrada=2026-10-10&salida=2026-10-13
// ======================================================

router.get("/precio", async (req, res) => {

    try {

        const { habitacion, entrada, salida } = req.query;

        const datos = await reservas.calcularPrecio(
            habitacion,
            entrada,
            salida
        );

        res.json(datos);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});


// ======================================================
// POST - CREAR RESERVA
// ======================================================

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


// ======================================================
// PUT - MODIFICAR RESERVA
// ======================================================

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


// ======================================================
// DELETE - CANCELAR RESERVA
// ======================================================

router.delete("/:id", async (req, res) => {

    try {

        const cancelada = await reservas.cancelarReserva(req.params.id);

        res.json(cancelada);

    } catch (error) {

        console.error(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});


module.exports = router;