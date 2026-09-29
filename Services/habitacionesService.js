const fs = require("fs");

const path = require("path");

    const ruta = path.join(
        __dirname,
        "..",
        "Data",
        "habitaciones.txt"
    );

function obtenerHabitaciones(){

    const contenido = fs.readFileSync(
        ruta,
        "utf8"
    );

    const lineas = contenido
        .trim()
        .split(/\r?\n/);

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

function obtenerHabitacion(numero){

    return obtenerHabitaciones().find(
        (h) => h.numero === String(numero)
    );

}


function cambiarEstado(numero, nuevoEstado){

    const habitaciones = obtenerHabitaciones();

    habitaciones.forEach((h) => {

        if (h.numero === String(numero)) {
            h.estado = nuevoEstado;
        }

    });

    const texto = habitaciones
        .map((h) =>
            [h.numero, h.tipo, h.capacidad, h.precio, h.estado].join(",")
        )
        .join("\n");

    fs.writeFileSync(ruta, texto, "utf8");
}


module.exports={obtenerHabitaciones, obtenerHabitacion, cambiarEstado};