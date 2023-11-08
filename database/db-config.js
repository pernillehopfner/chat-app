module.exports = {
    HOST: "dbaaserver.database.windows.net",
    USER: "Nina",
    PASSWORD: "Hej12345",
    DB: "Magasin",
    dialect: "mssql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};