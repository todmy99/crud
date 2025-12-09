//servidor express basico

const express = require("express");
const path = require("path");

const topicRoutes = require("./routes/topicRoutes");

const app = express();
const PORT = 3000;

// 1) configurar motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2) middleware para leer datos de formularios (req.body)
app.use(express.urlencoded({ extended: true }));

//3) servir archivos estaticos (JS del frontend)
app.use(express.static(path.join(__dirname, "public")));

//4) rutas principales
app.use("/topics", topicRoutes);

//5) redirigir la raiz "/" a "/topics"
app.get("/", (req, res) => {
    res.redirect("/topics");
});

//6) levantar el servidor
app.listen(PORT, () => {
    console.log(`servidor escuchando en https://localhost:${PORT}`)
});