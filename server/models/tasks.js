'use strict';
module.exports = (sequelize, DataTypes) => {
    let Tasks = sequelize.define(
        'Tasks', {
            task_name: {
                type: DataTypes.STRING,
                unique: true
            },
            s3_object: DataTypes.STRING,
            task_audience: DataTypes.STRING,
        },
        {
            underscored: true
        });

    Tasks.associate = function (models) {
        models.Tasks.hasMany(models.ServersTasks, { as: 'server_tasks' });

    };

    return Tasks;
};
