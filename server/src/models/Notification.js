module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    type: {
      type: DataTypes.ENUM('moderation', 'system'),
      defaultValue: 'moderation',
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Notification.associate = models => {
    Notification.belongsTo(models.Users, { foreignKey: 'userId' });
  };

  return Notification;
};