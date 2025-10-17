import request from "supertest";
import server from "../../server";

describe("POST /api/productos", () => {
  it("Debe mostrar los errores de validacion", async () => {
    const res = await request(server).post("/api/productos").send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(4);

    expect(res.status).not.toBe(404);
    expect(res.body.errores).not.toHaveLength(2);
  });

  it("El precio debe ser mayor a 0", async () => {
    const res = await request(server).post("/api/productos").send({
      nombre: "Mouse Prueba",
      precio: 0,
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);

    expect(res.status).not.toBe(404);
    expect(res.body.errores).not.toHaveLength(2);
  });

  it("El precio debe ser un numero mayor a cero", async () => {
    const res = await request(server).post("/api/productos").send({
      nombre: "Mouse Prueba",
      precio: "Hola",
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(2);

    expect(res.status).not.toBe(404);
    expect(res.body.errores).not.toHaveLength(4);
  });

  it("Debe crear un nuevo producto", async () => {
    const res = await request(server).post("/api/productos").send({
      nombre: "Mouse Prueba",
      precio: 50,
    });

    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(404);
    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("errores");
  });
});

describe("GET /api/productos", () => {
  it("Debe checkear si la url existe", async () => {
    const res = await request(server).get("/api/productos");
    expect(res.status).not.toBe(404);
  });

  it("Obtener una respuesta JSON de productos", async () => {
    const res = await request(server).get("/api/productos");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toHaveProperty("data");

    expect(res.body.data).toHaveLength(1);
    expect(res.body).not.toHaveProperty("errores");
  });
});

describe("GET /api/productos/:id", () => {
  it("Debe retornar un error 404 para un producto que no exista", async () => {
    const idProducto = 2000;
    const res = await request(server).get(`/api/productos/${idProducto}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBe("Producto no encontrado");
  });

  it("Debe checkear que sea un id valido en la URL", async () => {
    const res = await request(server).get("/api/productos/url-no-valida");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe("El id no es válido");
  });

  it("Obtener una respuesta JSON de un producto", async () => {
    const res = await request(server).get("/api/productos/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
  });
});

describe("PUT /api/productos/:id", () => {
  it("Debe checkear que sea un id valido en la URL", async () => {
    const res = await request(server).put("/api/productos/url-no-valida").send({
      nombre: "Monitor Actualizado",
      precio: 300,
      disponible: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe("El id no es válido");
  });

  it("Debe mostrar los mensajes de validacion cuando un producto es actualizado", async () => {
    const res = await request(server).put("/api/productos/1").send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toBeTruthy();
    expect(res.body.errores).toHaveLength(5);

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Debe tener un precio valido", async () => {
    const res = await request(server).put("/api/productos/1").send({
      nombre: "Mouse Prueba Actualizado",
      precio: 0,
      disponible: true,
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores).toBeTruthy();
    expect(res.body.errores).toHaveLength(1);
    expect(res.body.errores[0].msg).toBe("El precio no es válido");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Debe retornar una respuesta 404 para un producto no encontrado", async () => {
    const idProducto = 2000;
    const res = await request(server).put(`/api/productos/${idProducto}`).send({
      nombre: "Mouse Prueba",
      precio: 300,
      disponible: true,
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Actualizar producto existente con datos validos", async () => {
    const res = await request(server).put(`/api/productos/1`).send({
      nombre: "Mouse Prueba Actualizado",
      precio: 500,
      disponible: true,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");

    expect(res.status).not.toBe(400);
    expect(res.body).not.toHaveProperty("errors");
  });
});

describe("PATCH /api/productos/:id", () => {
  it("Debe retornar una respuesta 404 para un producto que no existe", async () => {
    const idProducto = 2000;
    const res = await request(server).patch(`/api/productos/${idProducto}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");

    expect(res.status).not.toBe(200);
    expect(res.body).not.toHaveProperty("data");
  });

  it("Debe actualizar la disponibilidad del producto", async () => {
    const res = await request(server).patch("/api/productos/1");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.disponible).toBe(false);

    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
    expect(res.body).not.toHaveProperty("error");
  });
});

describe("DELETE /api/productos/:id", () => {
  it("Debe revisar un id valido", async () => {
    const res = await request(server).delete("/api/productos/url-no-valida");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errores");
    expect(res.body.errores[0].msg).toBe("El id no es válido");
  });

  it("Debe retornar un respuesta 404 para un producto no encontrado", async () => {
    const idProducto = 2000;
    const res = await request(server).delete(`/api/productos/${idProducto}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Producto no encontrado");

    expect(res.status).not.toBe(200);
  });

  it("Debe eliminar un produto", async () => {
    const res = await request(server).delete("/api/productos/1");

    expect(res.status).toBe(200);
    expect(res.body.data).toBe("Producto eliminado");
    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
  });
});
