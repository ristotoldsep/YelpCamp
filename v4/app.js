//                7 RESTFUL ROUTES
//--------------------------------------------------------------------------------------------------------
//name          url             verb          desc.									Mongoose method
//=========================================================================================================
//INDEX       /campgrounds       GET		Displays all campgrounds				campgrounds.find()
//NEW 		 /campgrounds/new	 GET		Displays form for new CG				N/A
//CREATE	  /campgrounds       POST		Add new CG to database					campgrounds.create()
//SHOW	  /campgrounds/:id     	 GET		Show info about one campground!			campgrounds.findById()
//EDIT     /campgrounds/:id/edit GET		Show edit form for campgrounds			campgrounds.findById()
//UPDATE	/campgrounds/:id	 PUT		Update CG, then redirect somewhere		campgrounds.findByIdAndUpdate()
//DESTROY   /campgrounds/:id	 DELETE		Delete CG, then redirect somewhere		campgrounds.findByIdAndRemove()

//NEW COMMENT ROUTES!!!!!!! in v4  CALLED NESTED!! ROUTES

//NEW   	campgrounds/:id/comments/new   GET
//CREATE    campgrounds/:id/comments       POST



const express    = require("express"),
	  app        = express(),
	  bodyParser = require("body-parser"),
	  mongoose   = require("mongoose"), //added mongoose database
	  port  	 = process.env.PORT || 3000,
	  Campground = require("./models/campground"),
	  Comment    = require("./models/comment"),
	  seedDB     = require("./seeds");
		
	  // Comment = require("./models/comment"),
	  // User = require("./models/user"),

seedDB(); //Every time we start the server, wipe everything!
mongoose.connect('mongodb://localhost:27017/yelp_camp_v4', { //connected to a yelpcamp DB
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message)); //CALLED PROMISES, had to add with new version of mongoose

app.use(bodyParser.urlencoded({extended: true})); //To get input from form
app.set("view engine", "ejs");

//SCHEMAS IN MODULE FILE NOW

// Landing Page - ROOT ROUTE
app.get("/", function(req, res)
	   {
	res.render("landing");
});

// INDEX - Shows all Campgrounds
app.get("/campgrounds", function(req, res)
	   {
	//Need to get all campgrounds from DB!
	// res.render("campgrounds", {campgrounds: campgrounds});
	
	Campground.find({}, function(err, allCampgrounds)
				   {
		if(err) {
			console.log(error);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

//CREATE - creating new CG
app.post("/campgrounds", function(req, res)
		{
// 	get data from form and add to campgrounds array
	var name = req.body.name; 
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc }; //New object 
	// campgrounds.push(newCampground); //Adding to array
	Campground.create(newCampground, function(err, newlyCreated)
					 {
		if(err) {
			console.log(err)
		} else{
			// console.log(newlyCreated);
			//Redirect back to campgrounds site!
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to add more CG-s
app.get("/campgrounds/new", function(req, res)
	   {
	res.render("campgrounds/new");
});

//SHOW - Will show info about specific CG (must come after "new", because : means anything after /campground)
app.get("/campgrounds/:id", function(req, res)
	   {
	//find the CG with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) { //so we would get comments not just their id-s
		if(err) {
			console.log(err);
		} else {
			//render template with id info
			//console.log(foundCampground); 
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//================
//COMMENTS ROUTES
//================

//COMMENTS NEW ROUTE
app.get("/campgrounds/:id/comments/new", (req, res) => {
	//finc campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

//COMMENTS CREATE ROUTE - this is called CALLBACK HELL
app.post("/campgrounds/:id/comments", (req, res) => {
	//lookup campground using id
	Campground.findById(req.params.id, (err, campground) => {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//console.log(req.body.comment); //Outputs object with author and text!!! Thanks to comment[text] syntax I wrote to new.ejs
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
	//create new comments
	//connect new comment to campground
	//redirect campground show page
	
}); 

//Start server
app.listen(port, function()
		  {
	console.log("YelpCamp server has started!")
});