const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { api_secret, api_token_expired_time } = require("./config");
const { agregarUsuario, login } = require("./modules/controlador_usuarios");
const {
  verificarAutenticacion,
  verificarCredenciales,
} = require("./modules/middleware");
const { obtenerUsuario } = require("./modules/controlador_usuarios");

const app = express();
app.listen(3000, console.log("SERVER ON"));
app.use(cors());
app.use(express.json());

app.post("/usuarios", async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const userAdded = await agregarUsuario(email, password, rol, lenguage);
    if (userAdded) {
      res.status(200).send({ message: "Usuario agregado correctamente" });
    } else {
      res.status(500).send({ message: "Error al agregar usuario" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al agregar usuario" });
  }
});

app.post("/login", verificarCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body;
    const success = await login(email, password);
    if (!success) {
      res.status(401).send({ message: "Credenciales incorrectas" });
      return;
    }
    const token = jwt.sign({ email }, api_secret, {
      expiresIn: api_token_expired_time,
    });
    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al verificar credenciales" });
  }
});

app.get("/usuarios", verificarAutenticacion, async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const user = await obtenerUsuario(userEmail);
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error al obtener el usuario" });
  }
});
