const dbConfig = require("./db-config.js");
const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    }, dialectOptions: {
    options: { encrypt: true }
}
});

sequelize.authenticate().then(() => {
    console.log('Databasen er forbundet');
})
.catch((err) => {
    console.log('Kan ikke forbinde til databasen', err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users-model.js")(sequelize, Sequelize);

module.exports = db;