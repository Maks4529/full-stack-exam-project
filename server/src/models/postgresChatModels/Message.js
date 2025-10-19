module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sender_id: { type: DataTypes.INTEGER },
    body: { type: DataTypes.TEXT, allowNull: false },
    conversation_id: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    timestamps: false,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: 'sender_id' });
    Message.belongsTo(models.Conversation, { foreignKey: 'conversation_id' });
  };

  return Message;
};