let express = require('express')

let app = express()

let pagerouter = require('./router/pagerouter.js')
let ajaxrouter = require('./router/ajaxrouter.js')
app.use(pagerouter)
app.use(ajaxrouter)

app.listen(9081,()=>{
    console.log('9081端口已经开放')
})

