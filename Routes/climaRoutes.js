// Basado en SISD-S4: routes/graphqlRoutes.js

const express = require("express");

const {
    obtenerClima
} = require("../Services/climaService");

const router = express.Router();


// ============================================
// GET /api/clima
// (graphqlRoutes.js:15-31)
// ============================================

router.get("/clima", async (req, res) => {

    try {

        const datos = await obtenerClima();

        res.json(datos);

    } catch (error) {

        console.error("Error obteniendo el clima:", error);

        res.status(500).json({
            error: "No fue posible obtener el clima del hotel. Verifique su conexión a internet o intente más tarde."
        });
    }
});


module.exports = router;
