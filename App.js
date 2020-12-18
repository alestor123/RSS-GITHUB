#!/usr/bin/env node
require('dotenv').config()

var express = require('express'),
app = express(),
chalk = require('chalk'),
axios = require('axios'),
RSS = require('rss'),
fs = require('fs'),
options  = require('minimist')(process.argv.slice(2));
path = require('path'),
pck = require('./package.json'),
rateLimit = require("express-rate-limit"),
marked = require('marked'),
api = 'https://api.github.com/',
argv = process.argv[2],
token = process.env.TOKEN,
reqLimit = process.env.LIMIT || 50,
port = process.env.PORT || argv || 3000,
limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 15 minutes
	max: reqLimit*2, 	
	message:'Your Limit Has Exceeded'
});
if (token) {
	axios.defaults.headers.common['Authorization'] = token;
	logger(`Got Token ${token}`)
}
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(limiter)

app.get('/github', (req,res) => {
	res.redirect(pck.homepage)
	logger.req('Redirect',req)
})

app.get('/issues/:name/:repo',limiter, (req, res) => {
    logger.req(`Name : ${req.params.name} Repo : ${req.params.repo}`,req)
    const feed = new RSS({
		title: `${req.params.name}/${req.params.repo}`,
		generator: 'gh-feed',
		feed_url: req.url,
		site_url: `https://github.com/${req.params.name}/${req.params.repo}/${req.params[0]}${req.search}`,
		image_url: `https://github.com/${req.params.name}.png`,
		ttl: 60
    })
    
    axios.get(api+'repos/'+req.params.name+'/'+req.params.repo+'/issues')
    .then((response) => {
		response.data.forEach(issue => {
			feed.item({
				title: issue.title,
				url: issue.html_url,
				categories: issue.labels.map(label => label.name),
				author: issue.user.login,
				date: issue.created_at,
				description: marked(issue.body)
			})
        })
        res.contentType('application/xml').header('Cache-Control', 'no-cache,max-age=600').send(feed.xml())
    })
    .catch((error) => {
	res.send('We Got An Error Please Try Later')
	logger.err(error)
    })

})

// port listen
app.listen(port, () => logger(`Server running at ${port}`))

// logger 
function logger(message){
console.log(chalk.bgYellow.red(`(LOG):${Date()}:${message}`))
fsLog(message)
}

logger.req = (message,req) => {
console.log(chalk.bgYellow.blue(`(REQUEST):${Date()}:Ip : ${req.ip} : ${message}`))
fsLog(message)
}
logger.err = (message) => {
console.error(chalk.bgRed.green(`(ERROR):${Date()} : ${message}`))
fsLog(message)
}
// Main 
// file logging 
function fsLog(logText) {
	if(true){
	fs.appendFile('logs.log',`\n ${logText} \n` , (err) => {
		if (err) throw err;
	  });
		}
}
	