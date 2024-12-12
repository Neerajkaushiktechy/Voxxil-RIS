module.exports = {
    development: {
        client: 'mssql',
        // trustServerCertificate:true,
        connection: {
          database: process.env.MS_SQL_DATABASE,
          server: process.env.MS_SQL_SERVER,
          user: process.env.MS_SQL_USERNAME,
          password: process.env.MS_SQL_PASSWORD,
          port: 1433, // process.env.MS_SQL_PORT,
          connectionTimeout: 30000,
          options: {
            encrypt: true,
            trustServerCertificate: true,
          },
          
        },
    }
}
// const knex = require('knex');
// console.log(process.env.MS_SQL_DATABASE)
// const mssqlConn = knex({
//     client: 'mssql',
//     connection: {
//       database: process.env.MS_SQL_DATABASE,
//       server: process.env.MS_SQL_SERVER,
//       user: process.env.MS_SQL_USERNAME,
//       password: process.env.MS_SQL_PASSWORD,
//       port: process.env.MS_SQL_PORT,
//       connectionTimeout: 30000,
//       options: {
//         encrypt: true,
//       },
//     },
// });

// module.exports = mssqlConn; 