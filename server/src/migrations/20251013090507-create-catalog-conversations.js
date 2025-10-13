'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('catalog_conversations', {
      catalog_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Catalogs', key: 'id' },
        onDelete: 'CASCADE',
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Conversations', key: 'id' },
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addConstraint('catalog_conversations', {
      fields: ['catalog_id', 'conversation_id'],
      type: 'primary key',
      name: 'pk_catalog_conversations',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('catalog_conversations');
  },
};

