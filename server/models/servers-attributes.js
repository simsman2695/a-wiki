'use strict';
module.exports = (sequelize, DataTypes) => {

    let ServersAttributes = sequelize.define(
        'ServersAttributes',
        {
            server_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'Servers',
                    key: 'id'
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            value: DataTypes.STRING
        },
        {
            underscored: true
        });

    ServersAttributes.associate = function (models) {
        ServersAttributes.belongsTo(models.Servers);
    };

    return ServersAttributes;
};
