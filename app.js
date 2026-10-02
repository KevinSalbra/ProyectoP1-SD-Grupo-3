const express = require("express");
const path = require("path");

const habitacionesRoutes = require("./Routes/habitacionesRoutes");
const clientesRoutes = require("./Routes/clientesRoutes");
const reservasRoutes = require("./Routes/reservasRoutes");
const rpcRoutes = require("./Routes/rpcRoutes");
const climaRoutes = require("./Routes/climaRoutes");

const app = express();

app.use(express.static("Public"));

app.use(express.json());

app.use("/api/habitaciones", habitacionesRoutes);
app.use("/api/clientes", clientesRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/", rpcRoutes);
app.use("/api", climaRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "index.html"));
});

app.get("/habitaciones", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "habitaciones.html"));
});

app.get("/clientes", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "clientes.html"));
});

app.get("/reservas", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "reservas.html"));
});

app.get("/reportes", (req, res) => {
    res.sendFile(path.join(__dirname, "Views", "reportes.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});