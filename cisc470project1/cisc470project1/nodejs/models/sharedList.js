const { Model, DataTypes } = require('sequelize');

class SharedList extends Model {
    static initModel(sequelize) {
        return SharedList.init(
            {
                owner_id: { type: DataTypes.INTEGER, allowNull: false },
                shared_with_id: { type: DataTypes.INTEGER, allowNull: false }
            },
            {
                sequelize,
                modelName: 'SharedList',
                tableName: 'shared_lists',
                timestamps: false
            }
        );
    }

    static associate(models) {
        SharedList.belongsTo(models.User, { foreignKey: 'owner_id', as: 'Owner' });
        SharedList.belongsTo(models.User, { foreignKey: 'shared_with_id', as: 'SharedWith' });
    }
}

module.exports = SharedList;
