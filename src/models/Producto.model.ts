import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
  tableName: "productos",
})
class Producto extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare nombre: string;

  @Column({
    type: DataType.FLOAT,
  })
  declare precio: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare disponible: boolean;
}

export default Producto;
