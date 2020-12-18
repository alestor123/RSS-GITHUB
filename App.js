#!/usr/bin/env node
require('dotenv').config()

var express = require('express'),
app = express(),
argv = process.argv[2],
chalk = require('chalk'),
port = process.env.PORT || argv || 3000;
app.listen(port, () => console.log(chalk.bgYellow.red(logger(`Server running at ${port}`))))
function logger(message){
return `(LOG):${Date()}:${message}`
}