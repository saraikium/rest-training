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
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {}
  );
  Comment.associate = function(models) {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      foreignKeyConstraint: true
    });
    Comment.belongsTo(models.Post, {
      as: 'comments',
      foreignKey: 'postId',
      foreignKeyConstraint: true
    });
    Comment.hasMany(models.Comment, {
      as: 'replies',
      foreignKey: 'parentId',
      foreignKeyConstraint: true
    });
  };
  return Comment;
};
