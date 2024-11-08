const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const basename = path.basename(__filename);

const db = {};

// Import all models in the directory
fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach(file => {
        let model = require(path.join(__dirname, file));
        model = model.initModel(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// Set up model associations if any
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
