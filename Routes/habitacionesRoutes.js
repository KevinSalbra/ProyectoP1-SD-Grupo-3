const express = require("express");

const router = express.Router();

const habitaciones = require("../Services/habitacionesService");


router.get("/", (req, res) => {

    const datos = habitaciones.obtenerHabitaciones();

    res.json(datos);

});


module.exports = router;