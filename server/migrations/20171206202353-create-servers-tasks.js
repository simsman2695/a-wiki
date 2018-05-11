'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ServersTasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            server_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Servers',
                    key: 'id'
                },
            },
            task_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
                references: {
                    model: 'Tasks',
                    key: 'id'
                },
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ServersTasks');
    }
};
