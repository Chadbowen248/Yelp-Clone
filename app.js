var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");


//--------------------------DATABASE-----------------------------------------//

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

//THIS CREATES AN ENTRY TO THE DB AND PUSHES IT TO INDEX

// Campground.create(
//   {
//     name: "Yosemite", 
//     image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
//     description: "This is where Yogi Bear lives"
//   }, function(err, campground){
//     if(err){
//       console.log(err);
//     } else {
//       console.log("New Campground Created: ");
//       console.log(campground);
//     }
//   });
  
  
  
//---------------------ROUTES-------------------------------------------------//

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {

    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
      if(err) {
        console.log(err);
      } else {
        res.render("index", {campgrounds: allCampgrounds})
      }
    })
});


app.post("/campgrounds", function(req,res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {name: name, image: image, description: desc};
  Campground.create(newCampground, function(err, newlyCreatedCamp){
    if(err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    
    }
  });
});


app.get("/campgrounds/new", function(req,res) {
  res.render("new.ejs");
});

//SHOW - shows more info about one campground //

app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided ID
  //render the show template with that campground
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render("show", {campground: foundCampground});
    }
  })
  //
  
});



//--------------------SERVER START--------------------------------------------//

app.listen(process.env.PORT,process.env.IP, function() {
    console.log("server is up");
});

