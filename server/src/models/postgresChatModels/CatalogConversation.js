module.exports = (sequelize, DataTypes) => {
  const CatalogConversation = sequelize.define('CatalogConversation', {
    catalog_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    timestamps: false,
    tableName: 'catalog_conversations',
  });

  return CatalogConversation;
};