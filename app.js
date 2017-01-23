var express = require('express'),
    ejs     = require('ejs'),
    app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is up and running");
});