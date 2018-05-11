'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ServersAttributes', {
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
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            value: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ServersAttributes');
    }
};
