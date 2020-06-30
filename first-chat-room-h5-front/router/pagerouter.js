let express = require('express')

let pagerouter = express.Router()

pagerouter.use('/',function(request,response,next){
    response.setHeader('Access-Control-Allow-Origin', '*');
    next()
})

pagerouter.use('/page/signup',express.static('./public/signup'))
pagerouter.use('/page/fallback',express.static('./public/fallback'))

module.exports = pagerouter
