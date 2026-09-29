const fs = require("fs");

const path = require("path");

const habitaciones = require("./habitacionesService");
const clientes = require("./clientesService");
const rpc = require("./rpcService");

const ruta = path.join(
    __dirname, 
    "..", 
    "Data", 
    "reservas.txt"
);

function obtenerReservas(){

    const contenido = fs.readFileSync(ruta, "utf8").trim();

    if (contenido === "") {
        return [];
    }

    const lineas = contenido.split(/\r?\n/);

    const reservas = lineas.map((linea) => {

        const datos = linea.split(",");

        const cliente = clientes.obtenerCliente(datos[1]);

        return {
            id: Number(datos[0]),
            clienteId: Number(datos[1]),
            clienteNombre: cliente ? cliente.nombre : "(sin cliente)",
            habitacion: datos[2],
            entrada: datos[3],
            salida: datos[4],
            huespedes: Number(datos[5]),
            noches: Number(datos[6]),
            total: Number(datos[7])
        };

    });

    return reservas;
}


function guardarReservas(reservas){

    const texto = reservas
        .map((r) =>
            [
                r.id, r.clienteId, r.habitacion, r.entrada,
                r.salida, r.huespedes, r.noches, r.total
            ].join(",")
        )
        .join("\n");

    fs.writeFileSync(ruta, texto, "utf8");
}


function validarHuespedes(huespedes, habitacion){

    if (!huespedes || huespedes < 1) {

        throw new Error(
            "La cantidad de huéspedes debe ser al menos 1."
        );

    }

    if (huespedes > habitacion.capacidad) {

        throw new Error(
            `La habitación ${habitacion.numero} tiene capacidad ` +
            `para ${habitacion.capacidad} huésped(es).`
        );

    }

}

async function crearReserva(datos){

    const cliente = clientes.obtenerCliente(datos.clienteId);

    if (!cliente) {
        throw new Error("El cliente seleccionado no existe.");
    }

    const habitacion = habitaciones.obtenerHabitacion(datos.habitacion);

    if (!habitacion) {
        throw new Error("La habitación seleccionada no existe.");
    }

    if (habitacion.estado !== "Disponible") {

        throw new Error(
            `La habitación ${habitacion.numero} no está disponible.`
        );

    }

    if (!datos.entrada || !datos.salida) {

        throw new Error(
            "Las fechas de entrada y salida son obligatorias."
        );

    }

    const hoy = new Date().toISOString().slice(0, 10);

    if (datos.entrada < hoy) {

        throw new Error(
            "La fecha de entrada no puede estar en el pasado."
        );

    }

    const huespedes = Number(datos.huespedes);

    validarHuespedes(huespedes, habitacion);

    const respuesta = await rpc.calcularPrecio(
        habitacion.precio,
        datos.entrada,
        datos.salida
    );


    const reservas = obtenerReservas();

    let id = 1;

    reservas.forEach((r) => {

        if (r.id >= id) {
            id = r.id + 1;
        }

    });

    const nueva = {
        id: id,
        clienteId: cliente.id,
        habitacion: habitacion.numero,
        entrada: datos.entrada,
        salida: datos.salida,
        huespedes: huespedes,
        noches: respuesta.result.noches,
        total: respuesta.result.total
    };

    reservas.push(nueva);

    guardarReservas(reservas);

    habitaciones.cambiarEstado(habitacion.numero, "Reservada");

    return nueva;
}

async function modificarReserva(id, datos){

    const reservas = obtenerReservas();

    const reserva = reservas.find((r) => r.id === Number(id));

    if (!reserva) {
        throw new Error("La reserva no existe.");
    }

    const habitacion = habitaciones.obtenerHabitacion(reserva.habitacion);

    if (!datos.entrada || !datos.salida) {

        throw new Error(
            "Las fechas de entrada y salida son obligatorias."
        );

    }

    const huespedes = Number(datos.huespedes);

    validarHuespedes(huespedes, habitacion);

    const respuesta = await rpc.calcularPrecio(
        habitacion.precio,
        datos.entrada,
        datos.salida
    );

    reserva.entrada = datos.entrada;
    reserva.salida = datos.salida;
    reserva.huespedes = huespedes;
    reserva.noches = respuesta.result.noches;
    reserva.total = respuesta.result.total;

    guardarReservas(reservas);

    return reserva;
}

function cancelarReserva(id){

    const reservas = obtenerReservas();

    const reserva = reservas.find((r) => r.id === Number(id));

    if (!reserva) {
        throw new Error("La reserva no existe.");
    }

    const restantes = reservas.filter((r) => r.id !== Number(id));

    guardarReservas(restantes);

    habitaciones.cambiarEstado(reserva.habitacion, "Disponible");

    return reserva;
}


module.exports={
    obtenerReservas,
    crearReserva,
    modificarReserva,
    cancelarReserva
};