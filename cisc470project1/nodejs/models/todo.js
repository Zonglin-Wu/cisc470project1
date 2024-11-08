const { Model, DataTypes } = require('sequelize');

class Todo extends Model {
    static initModel(sequelize) {
        return Todo.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                },
                text: { type: DataTypes.STRING, allowNull: false },
                done: { type: DataTypes.BOOLEAN, defaultValue: false }
            },
            {
                sequelize,
                modelName: 'Todo',
                tableName: 'todos',
                timestamps: false
            }
        );
    }

    static associate(models) {
        Todo.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}

module.exports = Todo;
