'use strict';
module.exports = (sequelize, DataTypes) => {
  var CountriesData = sequelize.define('CountriesData', {
    // attributes
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shortenedCategory:{
        type: DataTypes.STRING,
        allowNull: false
    }
  });

  CountriesData.associate = function(models) {
    models.CountriesData.belongsTo(models.Countries, {
      onDelete: "CASCADE",
      foreignKey: 'countryId'
    });
  };

  return CountriesData;
};