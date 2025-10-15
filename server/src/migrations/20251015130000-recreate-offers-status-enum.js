'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        'ALTER TABLE "Offers" ALTER COLUMN "status" TYPE TEXT;',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Offers_status";',
        { transaction }
      );

      await queryInterface.sequelize.query(
        "CREATE TYPE \"enum_Offers_status\" AS ENUM ('pending','approved','rejected','won');",
        { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER TABLE "Offers" ALTER COLUMN "status" TYPE "enum_Offers_status" USING (status::text::"enum_Offers_status");',
        { transaction }
      );
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.sequelize.query(
        'ALTER TABLE "Offers" ALTER COLUMN "status" TYPE TEXT;',
        { transaction }
      );
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_Offers_status";',
        { transaction }
      );
      await queryInterface.sequelize.query(
        "CREATE TYPE \"enum_Offers_status\" AS ENUM ('pending','approved','rejected');",
        { transaction }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE "Offers" ALTER COLUMN "status" TYPE "enum_Offers_status" USING (status::text::"enum_Offers_status");',
        { transaction }
      );
    });
  },
};
