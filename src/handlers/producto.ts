import { Request, Response } from "express";
import Producto from "../models/Producto.model";

export const obtenerProductos = async (req: Request, res: Response) => {
  const productos = await Producto.findAll({
    order: [["id", "DESC"]],
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });
  res.json({ data: productos });
};

export const obtenerProductoPorId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  res.json({ data: producto });
};

export const crearProducto = async (req: Request, res: Response) => {
  /* Ejemplo validacion aqui
  await check("nombre")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacío")
    .run(req); */
  const producto = await Producto.create(req.body);
  res.status(201).json({ data: producto });
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  // Actualizar
  await producto.update(req.body);
  await producto.save();

  res.json({ data: producto });
};

export const actualizarDisponibilidad = async (req: Request, res: Response) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  // Actualizar
  producto.disponible = !producto.dataValues.disponible;
  await producto.save();
  res.json({ data: producto });
};

export const eliminarProducto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id);

  if (!producto) {
    return res.status(404).json({
      error: "Producto no encontrado",
    });
  }

  // Eliminar
  await producto.destroy();
  res.json({ data: "Producto eliminado" });
};
