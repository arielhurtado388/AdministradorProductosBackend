import { Router } from "express";
import {
  actualizarDisponibilidad,
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
} from "./handlers/producto";
import { body, param } from "express-validator";
import { handleErroresEntrada } from "./middleware";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *    Producto:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *          description: El id del producto
 *          example: 1
 *        nombre:
 *          type: string
 *          description: El nombre del producto
 *          example: Mouse Gamer
 *        precio:
 *          type: number
 *          description: El precio del producto
 *          example: 200
 *        disponible:
 *          type: boolean
 *          description: La disponibilidad del producto
 *          example: true
 */

// Routing

/**
 * @swagger
 * /api/productos:
 *  get:
 *    summary: Obtiene una lista de productos
 *    tags:
 *      - Productos
 *    description: Retorna una lista de productos
 *    responses:
 *      200:
 *        description: Respuesta exitosa
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Producto'
 */

router.get("/", obtenerProductos);

/**
 * @swagger
 * /api/productos/{id}:
 *  get:
 *    summary: Obtiene un producto por su id
 *    tags:
 *      - Productos
 *    description: Retorna un producto por su id único
 *    parameters:
 *    - in: path
 *      name: id
 *      description: El id del producto que deseas obtener
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Respuesta exitosa
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Producto'
 *      400:
 *        description: El id no es válido
 *      404:
 *        description: Producto no encontrado
 */

router.get(
  "/:id",
  param("id").isInt().withMessage("El id no es válido"),
  handleErroresEntrada,
  obtenerProductoPorId
);

/**
 * @swagger
 * /api/productos:
 *  post:
 *    summary: Crear un nuevo producto
 *    tags:
 *      - Productos
 *    description: Retorna un nuevo registro en la base de datos
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nombre:
 *                type: string
 *                example: "Mouse Gamer"
 *              precio:
 *                type: number
 *                example: 3.99
 *    responses:
 *      201:
 *        description: Respuesta exitosa
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Producto'
 *      400:
 *        description: Los datos enviados no son válidos
 */

router.post(
  "/",
  // Validacion
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacío"),

  body("precio")
    .isNumeric()
    .withMessage("El valor no es válido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacío")
    .custom((valor) => valor > 0)
    .withMessage("El precio no es válido"),

  handleErroresEntrada,

  crearProducto
);

/**
 * @swagger
 * /api/productos/{id}:
 *  put:
 *    summary: Actualizar un producto con los datos ingresados por el usuario
 *    tags:
 *      - Productos
 *    description: Retorna el producto actualizado
 *    parameters:
 *    - in: path
 *      name: id
 *      description: El id del producto que deseas actualizar
 *      required: true
 *      schema:
 *        type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              nombre:
 *                type: string
 *                example: "Mouse Gamer"
 *              precio:
 *                type: number
 *                example: 3.99
 *              disponible:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Respuesta exitosa
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Producto'
 *      400:
 *        description: El id no es válido o los datos ingresados no son válidos
 *      404:
 *        description: Producto no encontrado
 */

router.put(
  "/:id",
  // Validacion
  param("id").isInt().withMessage("El id no es válido"),

  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacío"),

  body("precio")
    .isNumeric()
    .withMessage("El valor no es válido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacío")
    .custom((valor) => valor > 0)
    .withMessage("El precio no es válido"),

  body("disponible")
    .isBoolean()
    .withMessage("El valor para la disponibilidad no es válido"),

  handleErroresEntrada,

  actualizarProducto
);

/**
 * @swagger
 * /api/productos/{id}:
 *  patch:
 *    summary: Actualiza la disponibilidad del producto
 *    tags:
 *      - Productos
 *    description: Retorna la disponibilidad actualizada
 *    parameters:
 *    - in: path
 *      name: id
 *      description: El id del producto que deseas actualizar
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Respuesta exitosa
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Producto'
 *      400:
 *        description: El id no es válido
 *      404:
 *        description: Producto no encontrado
 */

router.patch(
  "/:id",
  param("id").isInt().withMessage("El id no es válido"),
  handleErroresEntrada,
  actualizarDisponibilidad
);

/**
 * @swagger
 * /api/productos/{id}:
 *  delete:
 *    summary: Elimina un producto por su id
 *    tags:
 *      - Productos
 *    description: Retorna un mensaje de confirmación
 *    parameters:
 *    - in: path
 *      name: id
 *      description: El id del producto que deseas eliminar
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200:
 *        description: Respuesta exitosa
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: string
 *                  example: "Producto eliminado"
 *      400:
 *        description: El id no es válido
 *      404:
 *        description: Producto no encontrado
 */

router.delete(
  "/:id",
  param("id").isInt().withMessage("El id no es válido"),
  handleErroresEntrada,
  eliminarProducto
);

export default router;
