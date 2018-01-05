const Sequelize = require('sequelize');
const db = require('../');

module.exports = db.define('sequence', {
    name: {
        type: Sequelize.STRING
    },
    data: {
        type: Sequelize.JSON,
        allowNull: false
    },
    options: {
        type: Sequelize.JSON
    },
    tempo: {
        type: Sequelize.INTEGER,
        defaultValue: 100
    },
    sustain: {
        type: Sequelize.INTEGER,
        defaultValue: 100
    },
    accent: {
        type: Sequelize.INTEGER,
        defaultValue: 60
    }
})
