module.exports = (sequelize, DataTypes) => {
  const Catalog = sequelize.define(
    'Catalog',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      catalog_name: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      timestamps: false,
    }
  );

  Catalog.associate = (models) => {
    Catalog.belongsTo(models.User, { foreignKey: 'user_id' });
    Catalog.belongsToMany(models.Conversation, {
      through: models.CatalogConversation,
      foreignKey: 'catalog_id',
      otherKey: 'conversation_id',
    });
  };

  return Catalog;
};
