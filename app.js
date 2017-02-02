var express     =    require('express'),
    mongoose    =    require('mongoose'),
    bodyParser  =    require('body-parser'),
    unsplash    =    require('unsplash-api'),
    app         =    express();
//Connecting to database 
mongoose.connect('mongodb://localhost/restaurant');
//Testing mongoose connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We're connected!");
});
//mongoose Schema
var foodSchema = mongoose.Schema({
    name: String,
    price: Number,
    desc: String,
    image: String
});
var Food = mongoose.model('food', foodSchema);
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    Food.find({}, function(err, allItems){
        if(err) console.log(err);
       // console.log(allItems)
        res.render('index', {createdMenu:allItems});
    });
    
});
app.get('/foodlist', function(req,res){
    var tempImage = "image"
    res.render('addfood', {image: tempImage});
});
app.post('/addfood', function(req,res){
    //check to see if it not an image search
    console.log("inside post addfood")
    console.log(req.body.food)
    if(req.body.food != undefined) {
    var name = req.body.food,
        price = req.body.price,
        desc = req.body.desc,
        image = req.body.image,
        menuList = {name:name, price:price, desc:desc, image:image};
        Food.create(menuList, function(err, createdMenu){
            if(err) console.log(err);
            console.log(createdMenu)
            res.redirect('/')
        });
    } else {
        res.render('addfood', {image: req.body.image})
    }
});
//Providing client key to unsplash api
var clientId = process.env.CLIENTKEY; //this is required to verify your application's requests 
unsplash.init(clientId);
app.post("/search", function(req, res){
      unsplash.searchPhotos(req.body.image, null, null, 300, function(error, photos, link) {
          if(error) {
              console.log(error)
          } else {
          if(photos[0] === undefined){
               console.log("Not found")
               res.redirect("addfood") ;
          } else {
               res.render("search", {image:photos});
               //console.log(photos)
          }
          }
    });
      
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Server is up and running");
});