const mysql = require('mysql2')

var mysqlconnection = mysql.createConnection({
  host     : process.env.MY_SQL_SERVER,
  user     : process.env.MY_SQL_USERNAME,
  password : process.env.MY_SQL_PASSWORD,
  database : process.env.MY_SQL_DATABASE
});
 
// mysqlconnection.connect();
 
mysqlconnection.query('SELECT 1 + 1 AS solution', function (error, rows, fields) {
  if (error) throw error;
  console.log('The solution is: ', rows[0].solution);
});
// const [rows, fields] = await connection.execute('SELECT 1 + 1 AS solution')

// console.log(rows)
// console.log(fields)
 
// mysqlconnection.end();

// export default mysqlconnection;
module.exports = mysqlconnection