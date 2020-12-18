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




















// port listen
app.listen(port, () => console.log(chalk.bgYellow.red(logger(`Server running at ${port}`))))

// logger 
function logger(message){
return `(LOG):${Date()}:${message}`
}