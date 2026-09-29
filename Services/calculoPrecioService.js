const MS_POR_DIA = 24 * 60 * 60 * 1000;

function calcularPrecioReserva(precioNoche, entrada, salida){

    const inicio = new Date(entrada);
    const fin = new Date(salida);

    if (isNaN(inicio) || isNaN(fin)) {
        throw new Error("Las fechas no son válidas.");
    }

    const noches = Math.round((fin - inicio) / MS_POR_DIA);

    if (noches <= 0) {
        throw new Error("La salida debe ser posterior a la entrada.");
    }

    if (!(Number(precioNoche) > 0)) {
        throw new Error("El precio por noche no es válido.");
    }

    return {
        noches: noches,
        total: noches * Number(precioNoche)
    };
}

module.exports = { calcularPrecioReserva };