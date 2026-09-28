const express = require("express");
const path = require("path");

const habitacionesRoutes = require("./Routes/habitacionesRoutes");

const app = express();

app.use(express.static("Public"));

app.use("/api/habitaciones", habitacionesRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join( __dirname,"views","index.html"));
});

app.get("/habitaciones", (req, res) => {
    res.sendFile(path.join(__dirname,"views","habitaciones.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log( `Server is running on http://localhost:${PORT}`);
});
