const fs = require("fs");

const path = require("path");

const ruta = path.join(
    __dirname, 
    "..", 
    "Data", 
    "clientes.txt"
);

function obtenerClientes(){

    const contenido = fs.readFileSync(
        ruta, 
        "utf8"
    );

 
    const lineas = contenido
        .trim()
        .split(/\r?\n/);

    const clientes = lineas.map((linea) => {

        const datos = linea.split(",");

        return {
            id: Number(datos[0]),
            nombre: datos[1],
            cedula: datos[2],
            correo: datos[3],
            telefono: datos[4]
        };

    });

    return clientes;
}


function obtenerCliente(id){

    return obtenerClientes().find(
        (c) => c.id === Number(id)
    );

}

function registrarCliente(datos){

    const nombre = limpiar(datos.nombre);
    const cedula = limpiar(datos.cedula);
    const correo = limpiar(datos.correo);
    const telefono = limpiar(datos.telefono);

    if (!nombre || !cedula || !correo || !telefono) {

        throw new Error(
            "Todos los campos del cliente son obligatorios."
        );

    }

    if (!correo.includes("@")) {

        throw new Error(
            "El correo electrónico no es válido."
        );

    }

    const clientes = obtenerClientes();

    let id = 1;

    clientes.forEach((c) => {

        if (c.cedula === cedula) {

            throw new Error(
                "Ya existe un cliente con esa cédula."
            );

        }

        if (c.id >= id) {
            id = c.id + 1;
        }

    });

    const linea = [id, nombre, cedula, correo, telefono].join(",");

    if (clientes.length === 0) {
        fs.writeFileSync(ruta, linea, "utf8");
    } else {
        fs.appendFileSync(ruta, "\n" + linea, "utf8");
    }

    return { id, nombre, cedula, correo, telefono };
}


module.exports={
    obtenerClientes,
    obtenerCliente,
    registrarCliente
};