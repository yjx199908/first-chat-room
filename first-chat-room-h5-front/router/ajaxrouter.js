let ajaxrouter = require('express').Router()
let bodyParser = require('body-parser')
let operateDb = require('../operateDb/operateDb.js')

operateDb.creAndConn('localhost','root','bighand','oosystem')

let date = new Date()

let datestr = "" + date.getFullYear() % 1000 + (date.getMonth() + 1) + date.getDate() + date.getHours();

let tempaccountset = []

let allowToExec = true

setInterval(()=>{
    allowToExec = false
    datestr = new Date()
    datestr = "" + date.getFullYear() % 1000 + (date.getMonth() + 1) + date.getDate() + date.getHours();
    operateDb.execquery(`select * from accexist where account like '${datestr}%'`,(err,data)=>{
        tempaccountset = data.map(value=>{
            return value.account
        })
        allowToExec = true
    })
},1000 * 60 * 60 * 60)

ajaxrouter.use(bodyParser.urlencoded({ extended: false,limit:10*1024*1024})); //extended 拓展模式  limit 最大接收数据

ajaxrouter.post('/submit/signup',function(request,response){
    if(!allowToExec){
        response.send({
            success:false,
            msg:'system is too busy,please try it again sometime later'
        })
        return
    }

    let account = datestr + ((Math.random() * 10000).toFixed(0))
    while(tempaccountset.indexOf(account) >= 0){
        account = datestr + ((Math.random() * 10000).toFixed(0))
    }
    tempaccountset.push(account)
    let sqlstr = `insert into accounts(account,password,nickname,phone) values('${account}','${request.body.password}','${request.body.nickname}','${request.body.phone}') `
    operateDb.execquery(sqlstr,(err,data)=>{
        if(err){
            let arr = tempaccountset.filter(value=>{
                return value != account
            })

            tempaccountset = arr

            response.send({
                success:false,
                msg:'there are some problems in dbms'
            })
        }
        else{
            response.send({
                success:true,
                account
            })
        }
    })
    
})

ajaxrouter.post('/submit/loginin',function(request,response){
    let sqlstr = `select * from accounts where account = '${request.body.account}' and password='${request.body.password}'`
    operateDb.execquery(sqlstr,(err,data)=>{
        if(err){
            response.send({
                success:false,
                passwordTrue:false,
                accountmsg:{},
                msg:'there are some problems in dbms'
            })
        }
        else{
            if (data.length == 0){
                response.send({
                    success:true,
                    passwordTrue:false,
                    accountmsg:{},
                    msg:'error password'
                })
            }
            else{
                delete data[0].password
                response.send({
                    success:true,
                    passwordTrue:true,
                    accountmsg:data[0],
                    msg:'login success'
                })
            }
        }
    })
})

module.exports = ajaxrouter