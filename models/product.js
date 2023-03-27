"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // product.belongsTo(models.user, {
      //   onDelete: "SET NULL",
      //   onUpdate: "CASCADE",
      // });
    }
  }
  product.init(
    {
      product_name: DataTypes.STRING,
      price: DataTypes.DOUBLE,
      description: DataTypes.STRING,
      imageurl: DataTypes.JSON,
      // imageurl: DataTypes.STRING, // for single
      createdAt: DataTypes.DATE(6),
      updatedAt: DataTypes.DATE(6)
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
