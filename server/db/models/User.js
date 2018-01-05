const Sequelize = require('sequelize');
const db = require('../');

module.exports = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        },
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})
