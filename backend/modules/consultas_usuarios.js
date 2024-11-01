const pool = require("./conexion");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const agregarUsuarioDB = async (email, password, rol, lenguage) => {
  const consulta =
    "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)";
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const values = [email, hashedPassword, rol, lenguage];
  console.log("Insertando usuario:", values);
  try {
    const response = await pool.query(consulta, values);
    console.log("Usuario insertado con éxito");
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
};

const loginDB = async (email, password) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  try {
    const { rows } = await pool.query(consulta, values);
    if (!rows.length) {
      return false;
    }
    const hashedPassword = rows[0].password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
};

const obtenerUsuarioDB = async (email) => {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const values = [email];
  try {
    const { rows } = await pool.query(consulta, values);
    if (!rows.length) {
      throw { code: 404, message: "Usuario no encontrado" };
    }
    return rows[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = {
  agregarUsuarioDB,
  loginDB,
  obtenerUsuarioDB,
};
