const bcrypt = require('bcrypt');
const { MODERATOR, SALT_ROUNDS } = require('../constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Moderator',
        lastName: 'Test',
        displayName: 'moderator',
        email: 'moderator@gmail.com',
        password: bcrypt.hashSync('123456', SALT_ROUNDS),
        role: MODERATOR,
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', { email: 'moderator@gmail.com' });
  },
};
