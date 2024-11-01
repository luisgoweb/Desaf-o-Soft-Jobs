const {
  agregarUsuarioDB,
  loginDB,
  obtenerUsuarioDB,
} = require("./consultas_usuarios");

const agregarUsuario = async (email, password, rol, lenguage) => {
  if (!email || !password || !rol || !lenguage) {
    console.log("Todos los campos son requeridos.");
    return false;
  }
  const result = await agregarUsuarioDB(email, password, rol, lenguage);
  return result;
};

const login = async (email, password) => {
  if (!email || !password) {
    console.log("Todos los campos son requeridos.");
    return false;
  }
  const result = await loginDB(email, password);
  return result;
};

const obtenerUsuario = async (email) => {
  const user = await obtenerUsuarioDB(email);
  return user;
};

module.exports = { agregarUsuario, login, obtenerUsuario };
