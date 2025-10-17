import { conexionDB } from "../server";
import db from "../config/db";

jest.mock("../config/db");

describe("Conexion DB", () => {
  it("Debe manejar el error de conexion a la base de datos", async () => {
    jest
      .spyOn(db, "authenticate")
      .mockRejectedValueOnce(new Error("Hubo un error al conectar a la DB"));

    const consoleSpy = jest.spyOn(console, "log");

    await conexionDB();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Hubo un error al conectar a la DB")
    );
  });
});
