import express from "express";
import router from "./router";
import db from "./config/db";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi, { serve } from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";

// Conectar a BD
export async function conexionDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log(colors.magenta("Conexión exitosa a la DB"));
  } catch (error) {
    console.log(colors.red("Hubo un error al conectar a la DB"));
  }
}

conexionDB();

// Instancia de express
const server = express();

// Permitir conexiones
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(new Error("Error de CORS"));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

server.use(morgan("dev"));

server.use("/api/productos", router);

// Documentacion
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

export default server;
