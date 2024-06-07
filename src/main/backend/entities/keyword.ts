import { DataTypes, Model, Sequelize } from 'sequelize';

// Extend the Model class with the attributes interface
export class Keyword extends Model {
  declare id: number; // Note that the `null assertion` `!` is required in strict mode.

  declare keyword: string;

  declare reply: string;

  declare mode: string;

  declare platform_id: string;
}

export function initKeyword(sequelize: Sequelize) {
  Keyword.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      keyword: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      mode: {
        type: DataTypes.STRING(55),
        allowNull: false,
      },
      platform_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Keyword',
      tableName: 'keyword',
      timestamps: false,
    },
  );
}
