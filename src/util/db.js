var mysql = require('mysql');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'fashionct'
});

module.exports = conn;
