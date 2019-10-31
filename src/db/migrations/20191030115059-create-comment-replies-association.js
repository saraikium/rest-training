module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Comments', 'parentId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Comments', 'parentId');
  }
};
