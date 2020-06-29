let mysql = require('mysql')

let connection;
exports.creAndConn = function(host,user,password,database){
    connection = mysql.createConnection({
        host,
        user,
        password,
        database
    })
    connection.connect(()=>{
        console.log("oosystem连接成功")
    })
}

exports.execquery = function(sqlstr,callback){
    connection.query(sqlstr,(err,data,fields)=>{
        callback(err,data)
    })
}

exports.closeconn = function closeconnection(){
    connection.end();
}