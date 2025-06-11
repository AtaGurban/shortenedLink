import { Model, DataTypes } from "sequelize";
import sequelize from "../db.ts";

class ShortenedLink extends Model {
  declare id: number;
  declare originalUrl: string;
  declare alias: string;
  declare expiresAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ShortenedLink.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    originalUrl: { type: DataTypes.STRING, allowNull: false },
    alias: { type: DataTypes.STRING(30), allowNull: false },
    expiresAt: { type: DataTypes.DATEONLY, defaultValue: null },
  },
  {
    sequelize,
    modelName: "shortened-links",
    timestamps: true,
  }
);

class ShortenedLinkClick extends Model {
  declare id: number;
  declare linkId: number;
  declare ip: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ShortenedLinkClick.init(
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    ip: { type: DataTypes.STRING(50), allowNull: false },
  },
  {
    sequelize,
    modelName: "shortened-link-clicks",
    timestamps: true,
  }
);

ShortenedLink.hasMany(ShortenedLinkClick, {
  as: "clicks",
  foreignKey: "linkId",
});
ShortenedLinkClick.belongsTo(ShortenedLink, {
  as: "shortenedLink",
  foreignKey: "linkId",
});

export { ShortenedLink, ShortenedLinkClick };
