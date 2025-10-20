//Esto es para testear el token
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const payload = {
  id: 1,
  correo: "juan@example.com"
};

const secret = process.env.JWT_SECRET || "tu_secreto_temporal";
const token = jwt.sign(payload, secret, { expiresIn: "1h" });

console.log("Token generado:", token);