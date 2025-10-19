module.exports = (sequelize, DataTypes) => {
  const Offer = sequelize.define(
    'Offers',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      originalFileName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'won'),
        defaultValue: 'pending',
      },
    },
    {
      timestamps: false,
    }
  );

  Offer.associate = function (models) {
    const pick = (singular, plural) =>
      models[singular] || models[plural] || null;
    const UserModel = pick('User', 'Users');
    const ContestModel = pick('Contest', 'Contests');

    if (UserModel) {
      Offer.belongsTo(UserModel, { foreignKey: 'userId', targetKey: 'id' });
    }

    if (ContestModel) {
      Offer.belongsTo(ContestModel, {
        foreignKey: 'contestId',
        targetKey: 'id',
      });
    }
  };

  return Offer;
};
