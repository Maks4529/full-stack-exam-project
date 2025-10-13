'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_conversations', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Conversations', key: 'id' },
        onDelete: 'CASCADE',
      },
      black_list: { type: Sequelize.BOOLEAN, defaultValue: false },
      favorite: { type: Sequelize.BOOLEAN, defaultValue: false },
    });

    await queryInterface.addConstraint('user_conversations', {
      fields: ['user_id', 'conversation_id'],
      type: 'primary key',
      name: 'pk_user_conversations',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('user_conversations');
  },
};

