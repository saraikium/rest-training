import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists!'
        },
        validate: {
          isEmail: true
        }
      },
      passwordHash: {
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.VIRTUAL,
        validate: {
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/,
            msg:
              'Password must contain at least 8 chars, including an uppercase, lowercase, number and a special character.'
          }
        }
      }
    },
    {}
  );

  User.associate = function(models) {
    User.hasMany(models.Post, {
      as: 'posts',
      foreignKeyConstraint: true,
      foreignKey: 'userId'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      foreignKeyConstraint: true
    });
  };

  // Instance methods
  User.prototype.authenticate = function checkPassword(password) {
    const hash = this.getDataValue('passwordHash');
    return bcrypt.compare(password, hash);
  };
  // Hooks
  User.beforeCreate(user => {
    // eslint-disable-next-line
    user.passwordHash = bcrypt.hashSync(user.password, 12);
  });
  return User;
};
