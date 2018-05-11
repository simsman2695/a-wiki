'use strict';
module.exports = (sequelize, DataTypes) => {
    let ServersTasks = sequelize.define(
        'ServersTasks', {
            server_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Servers',
                    key: 'id'
                }
            },
            task_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Tasks',
                    key: 'id'
                }
            }
        }, {
            underscored: true
        });

    ServersTasks.associate = function (models) {
        ServersTasks.belongsTo(models.Servers);
        ServersTasks.belongsTo(models.Tasks);
    };

    return ServersTasks;
};
