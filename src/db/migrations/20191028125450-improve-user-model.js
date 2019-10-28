module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Users', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }),
      queryInterface.changeColumn('Users', 'passwordHash', {
        type: Sequelize.STRING,
        allowNull: false
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Users', 'email', {
        type: Sequelize.STRING
      }),
      queryInterface.changeColumn('Users', 'passwordHash', {
        type: Sequelize.STRING
      })
    ]);
  }
};
