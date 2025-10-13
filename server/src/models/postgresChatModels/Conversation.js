module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('Conversation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    timestamps: false,
  });

  Conversation.associate = (models) => {
    Conversation.belongsToMany(models.User, {
      through: models.UserConversation,
      foreignKey: 'conversation_id',
      otherKey: 'user_id',
    });
    Conversation.hasMany(models.Message, { foreignKey: 'conversation_id' });
    Conversation.belongsToMany(models.Catalog, {
      through: models.CatalogConversation,
      foreignKey: 'conversation_id',
      otherKey: 'catalog_id',
    });
  };

  return Conversation;
};