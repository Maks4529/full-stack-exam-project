module.exports = (sequelize, DataTypes) => {
  const UserConversation = sequelize.define('UserConversation', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    black_list: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: false,
    tableName: 'user_conversations',
  });

  return UserConversation;
};