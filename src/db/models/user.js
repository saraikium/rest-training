'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        },
        password: {
          type: DataTypes.VIRTUAL,
          allowNull: false,
          validate: {
            is: {
              args: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,30}$/
              ],
              msg:
                'Password should be 8-30 characters, one uppercase, one lowercase, one digit and a special character.'
            }
          }
        }
      }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
