module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      body: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
      as: 'comments',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    });
    Comment.belongsTo(models.Post, {
      as: 'comments',
      foreignKey: 'postId',
      foreignKeyConstraint: true
    });
  };
  return Comment;
};
