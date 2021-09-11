module.exports = (sequelize, DataTypes) => {
  var Countries = sequelize.define('Countries', {
    // attributes
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey:true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });

  return Countries;
};