var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myapptable'
});

connection.connect();

function query(sqlStr) {
    return new Promise((reslove, reject) => {
        connection.query(sqlStr, function (error, results, fields) {
            if (!error) {
                reslove([null, results])
            } else {
                reslove([error])
            }
        });
        // connection.end(); // Cannot enqueue Quit after invoking quit 调用一次关闭之后，需要重新启动，所以将此注释
    })
}

module.exports = {
    query
}