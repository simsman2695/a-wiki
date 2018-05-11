'use strict';
module.exports = (sequelize, DataTypes) => {
    let ServersServices = sequelize.define(
        'ServersServices', {
            server_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Servers',
                    key: 'id'
                }
            },
            name: DataTypes.STRING
        },
        {
            underscored: true
        });

    ServersServices.associate = function (models) {
        ServersServices.belongsTo(models.Servers);
    };

    return ServersServices;
};
