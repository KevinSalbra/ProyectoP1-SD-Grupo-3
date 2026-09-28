const fs = require("fs");

const path = require("path");


function obtenerHabitaciones(){

    const ruta = path.join(
        __dirname,
        "..",
        "Data",
        "habitaciones.txt"
    );

    const contenido = fs.readFileSync(
        ruta,
        "utf8"
    );

    const lineas = contenido
        .trim()
        .split("\n");

    const habitaciones = lineas.map((linea) => {

        const datos = linea.split(",");

        return {
            numero: datos[0],
            tipo: datos[1],
            capacidad: Number(datos[2]),
            precio: Number(datos[3]),
            estado: datos[4]
        };

    });

    return habitaciones;
}


module.exports={obtenerHabitaciones};