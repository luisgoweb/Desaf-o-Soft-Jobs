const jwt = require("jsonwebtoken");
const { api_secret } = require("../config");

const verificarAutenticacion = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({ message: "Se requiere autenticación" });
  }
  const token = authHeader.split("Bearer ")[1];
  if (!token) {
    return res
      .status(403)
      .send({ message: "Token no encontrado o mal formateado" });
  }
  try {
    const decoded = jwt.verify(token, api_secret);
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(401).send({ message: "Token no válido" });
  }
};

const verificarCredenciales = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Se requieren correo electrónico y contraseña" });
  }
  next();
};

module.exports = {
  verificarAutenticacion,
  verificarCredenciales,
};
