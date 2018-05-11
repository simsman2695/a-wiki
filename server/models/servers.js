'use strict';
module.exports = (sequelize, DataTypes) => {
    let Servers = sequelize.define(
        'Servers', {
            server_name: {
                type: DataTypes.STRING,
                unique: true,
            }
        },
        {
            underscored: true
        });

    Servers.associate = function (models) {
        models.Servers.hasMany(models.ServersServices, { as: 'services' });
        models.Servers.hasMany(models.ServersTasks, { as: 'tasks' });
        models.Servers.hasMany(models.ServersAttributes, { as: 'attributes' });
    };

    return Servers;
};
