const { DataTypes, Model} = require('sequelize');

class User extends Model {
    static initModel(sequelize) {
        return User.init(
            {
                email: { type: DataTypes.STRING, unique: true, allowNull: false },
                password: { type: DataTypes.STRING, allowNull: false }
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users',
                timestamps: false
            }
        );
    }

    static associate(models) {
        User.hasMany(models.Todo, { foreignKey: 'user_id', onDelete: 'CASCADE' });
        User.hasMany(models.SharedList, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
    }
}

module.exports = User;
