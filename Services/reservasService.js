const fs = require("fs");
const path = require("path");

const habitaciones = require("./habitacionesService");
const clientes = require("./clientesService");
const { calcularPrecioReserva } = require("./calculoPrecioService");
const { obtenerEthereum } = require("./rpcService");

const ruta = path.join(__dirname, "..", "Data", "reservas.txt");

// Formato de cada línea:
// id,clienteId,habitacion,entrada,salida,huespedes,noches,total,bloque


// ======================================================
// LEER Y GUARDAR EL ARCHIVO
// ======================================================

function obtenerReservas() {

    const contenido = fs.readFileSync(ruta, "utf8").trim();

    if (contenido === "") {
        return [];
    }

    const lineas = contenido.split(/\r?\n/);

    const reservas = lineas.map((linea) => {

        const datos = linea.split(",");

        const cliente = clientes.obtenerCliente(datos[1]);

        const bloque = datos[8] || "N/D";

        return {
            id: Number(datos[0]),
            clienteId: Number(datos[1]),
            clienteNombre: cliente
                ? cliente.nombre
                : "(sin cliente)",
            habitacion: datos[2],
            entrada: datos[3],
            salida: datos[4],
            huespedes: Number(datos[5]),
            noches: Number(datos[6]),
            total: Number(datos[7]),
            bloque: bloque,
            codigo: `RES-${datos[0]}-${bloque}`
        };

    });

    return reservas;
}


function guardarReservas(reservas) {

    const texto = reservas
        .map((r) =>
            [
                r.id,
                r.clienteId,
                r.habitacion,
                r.entrada,
                r.salida,
                r.huespedes,
                r.noches,
                r.total,
                r.bloque
            ].join(",")
        )
        .join("\n");

    fs.writeFileSync(ruta, texto, "utf8");
}


// ======================================================
// VALIDAR CANTIDAD DE HUÉSPEDES
// ======================================================

function validarHuespedes(huespedes, habitacion) {

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


// ======================================================
// CALCULAR PRECIO
// ======================================================

function calcularPrecio(numero, entrada, salida) {

    const habitacion = habitaciones.obtenerHabitacion(numero);

    if (!habitacion) {
        throw new Error(
            "La habitación seleccionada no existe."
        );
    }

    return calcularPrecioReserva(
        habitacion.precio,
        entrada,
        salida
    );
}


// ======================================================
// RPC - SELLO DE ETHEREUM
// ======================================================

async function obtenerSello() {

    try {

        const respuesta = await obtenerEthereum();

        const bloque = parseInt(
            respuesta.result,
            16
        );

        if (isNaN(bloque)) {
            throw new Error(
                "Ethereum no devolvió un número de bloque."
            );
        }

        return bloque;

    } catch (error) {

        console.error(
            "No se pudo obtener el sello de Ethereum:",
            error.message
        );

        return "N/D";

    }
}


// ======================================================
// POST - CREAR RESERVA
// ======================================================

async function crearReserva(datos) {

    const cliente = clientes.obtenerCliente(
        datos.clienteId
    );

    if (!cliente) {
        throw new Error(
            "El cliente seleccionado no existe."
        );
    }

    const habitacion = habitaciones.obtenerHabitacion(
        datos.habitacion
    );

    if (!habitacion) {
        throw new Error(
            "La habitación seleccionada no existe."
        );
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

    const hoy = new Date()
        .toISOString()
        .slice(0, 10);

    if (datos.entrada < hoy) {

        throw new Error(
            "La fecha de entrada no puede estar en el pasado."
        );

    }

    const huespedes = Number(
        datos.huespedes
    );

    validarHuespedes(
        huespedes,
        habitacion
    );

    const calculo = calcularPrecioReserva(
        habitacion.precio,
        datos.entrada,
        datos.salida
    );


    // --------------------------------------------------
    // LLAMADA RPC
    // --------------------------------------------------

    const bloque = await obtenerSello();


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
        noches: calculo.noches,
        total: calculo.total,
        bloque: bloque
    };

    reservas.push(nueva);

    guardarReservas(reservas);

    habitaciones.cambiarEstado(
        habitacion.numero,
        "Reservada"
    );

    nueva.codigo =
        `RES-${id}-${bloque}`;

    return nueva;
}


// ======================================================
// PUT - MODIFICAR RESERVA
// Fechas, huéspedes y habitación
// ======================================================

function modificarReserva(id, datos) {

    const reservas = obtenerReservas();

    const reserva = reservas.find(
        (r) => r.id === Number(id)
    );

    if (!reserva) {
        throw new Error(
            "La reserva no existe."
        );
    }

    // Habitación que tiene actualmente la reserva
    const habitacionAnterior =
        habitaciones.obtenerHabitacion(
            reserva.habitacion
        );

    if (!habitacionAnterior) {
        throw new Error(
            "La habitación actual de la reserva no existe."
        );
    }

    // Nueva habitación seleccionada
    const habitacionNueva =
        habitaciones.obtenerHabitacion(
            datos.habitacion
        );

    if (!habitacionNueva) {
        throw new Error(
            "La habitación seleccionada no existe."
        );
    }

    if (!datos.entrada || !datos.salida) {

        throw new Error(
            "Las fechas de entrada y salida son obligatorias."
        );

    }

    const huespedes = Number(
        datos.huespedes
    );

    validarHuespedes(
        huespedes,
        habitacionNueva
    );

    // Si se cambia de habitación,
    // la nueva debe estar disponible.
    if (
        habitacionNueva.numero !==
        habitacionAnterior.numero &&
        habitacionNueva.estado !== "Disponible"
    ) {

        throw new Error(
            `La habitación ${habitacionNueva.numero} no está disponible.`
        );

    }

    // Calcular nuevamente el precio
    // usando la nueva habitación.
    const calculo = calcularPrecioReserva(
        habitacionNueva.precio,
        datos.entrada,
        datos.salida
    );

    // Actualizar la reserva
    reserva.habitacion =
        habitacionNueva.numero;

    reserva.entrada =
        datos.entrada;

    reserva.salida =
        datos.salida;

    reserva.huespedes =
        huespedes;

    reserva.noches =
        calculo.noches;

    reserva.total =
        calculo.total;

    guardarReservas(reservas);


    // --------------------------------------------------
    // CAMBIO DE HABITACIÓN
    // --------------------------------------------------

    if (
        habitacionNueva.numero !==
        habitacionAnterior.numero
    ) {

        // La habitación anterior queda disponible
        habitaciones.cambiarEstado(
            habitacionAnterior.numero,
            "Disponible"
        );

        // La nueva habitación queda reservada
        habitaciones.cambiarEstado(
            habitacionNueva.numero,
            "Reservada"
        );

    }

    return reserva;
}


// ======================================================
// DELETE - CANCELAR RESERVA
// ======================================================

function cancelarReserva(id) {

    const reservas = obtenerReservas();

    const reserva = reservas.find(
        (r) => r.id === Number(id)
    );

    if (!reserva) {
        throw new Error(
            "La reserva no existe."
        );
    }

    const restantes = reservas.filter(
        (r) => r.id !== Number(id)
    );

    guardarReservas(restantes);

    habitaciones.cambiarEstado(
        reserva.habitacion,
        "Disponible"
    );

    return reserva;
}


// ======================================================
// EXPORTAR
// ======================================================

module.exports = {

    obtenerReservas,
    calcularPrecio,
    crearReserva,
    modificarReserva,
    cancelarReserva

};