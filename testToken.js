//Esto es para testear el token
/*
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const payload = {
  id: 1,
  correo: "juan@example.com",
  rol: "Admin"
};

const secret = process.env.JWT_SECRET || "tu_secreto_temporal";
const token = jwt.sign(payload, secret, { expiresIn: "1h" });

console.log("Token generado:", token);
*/
// testToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const payload = {
  id: 1,
  correo_electronico: "admin@gym.com",  // ← MISMO CAMPO QUE login
  rol: "Admin"
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

console.log("=== TOKEN DE PRUEBA (válido) ===");
console.log(token);
console.log("=================================");