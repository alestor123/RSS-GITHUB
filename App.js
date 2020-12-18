#!/usr/bin/env node
require('dotenv').config()

var express = require('express'),
app = express(),
chalk = require('chalk'),
axios = require('axios'),
RSS = require('rss'),
marked = require('marked')
api = 'https://api.github.com/',
pck = require('./package.json'),
argv = process.argv[2],
token = process.env.TOKEN,
port = process.env.PORT || argv || 3000,
headers = {
	'User-Agent': 'gh-feed',
	'Accept': 'application/vnd.github.v3+json'
};
if (token) {
	headers.Authorization = `token ${token}`
logger(`Got Token ${token}`)
}

app.get('/github', (req, res) => {
    res.redirect(pck.homepage)
})


app.get('/issues/:name/:repo', (req, res) => {
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
    console.error(error)
    })

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
// Main 