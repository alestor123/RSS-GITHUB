#!/usr/bin/env node
require('dotenv').config()

var express = require('express'),
app = express(),
chalk = require('chalk'),
axios = require('axios'),
pck = require('./package.json'),
argv = process.argv[2],
token = process.env.TOKEN,
port = process.env.PORT || argv || 3000;



app.get('/github', (req, res) => {
    res.redirect(pck.homepage)
})


app.get('/issues/:name/:repo', (req, res) => {
    logger.req(`Name : ${req.params.name} Repo : ${req.params.repo}`,req)
})


















// port listen
app.listen(port, () => logger(`Server running at ${port}`))

// logger 
function logger(message){
console.log(chalk.bgYellow.red(`(LOG):${Date()}:${message}`))
}

logger.req = (message,req) => {
    console.log(chalk.bgYellow.blue(`(REQUEST):${Date()}:Ip : ${req.ip} : ${message}`))
}