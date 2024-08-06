console.log('hellow server-db!');

const mysql      = require('mysql2');
const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '1q2w3e4r',
  database : 'FirstDatabase'
});

connection.connect();

connection.query('SELECT * from users', (error, rows, fields) => {
  if (error) throw error;
  console.log('User info is: ', rows);
});

connection.end();