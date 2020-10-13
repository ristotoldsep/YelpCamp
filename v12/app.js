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

//NEW   	campgrounds/:id/comments/new   GET
//CREATE    campgrounds/:id/comments       POST

const express    = require("express"),
	  app        = express(),
	  bodyParser = require("body-parser"),
	  mongoose   = require("mongoose"), //added mongoose database
	  passport   = require("passport"),
	  LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
	  port  	 = process.env.PORT || 3000,
	  Campground = require("./models/campground"),
	  Comment    = require("./models/comment"),
	  User       = require("./models/user"),
	  flash      = require("connect-flash"),
	  seedDB     = require("./seeds");

	  //Importing routes from different files to refactor code!
const commentRoutes     = require("./routes/comments"),
	  campgroundRoutes  = require("./routes/campgrounds"),
	  indexRoutes  		= require("./routes/index");
	
		
// seedDB(); //Every time we start the server, wipe everything!

//APP CONFIG
// mongoose.connect('mongodb://localhost:27017/yelp_camp_v4', { //connected to a yelpcamp local mongoose DB
mongoose.connect('mongodb+srv://ristotoldsep:Monsa1monsa@yelpcamp.foevj.mongodb.net/yelpcamp?retryWrites=true&w=majority', { //connected to a yelpcamp local mongoose DB
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => console.log('Connected to DB!!'))
.catch(error => console.log(error.message)); //CALLED PROMISES, had to add with new version of mongoose

app.use(bodyParser.urlencoded({extended: true})); //To get input from form
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public")); //__dirname something new!!!! takes whole path
//console.log(__dirname);
app.use(methodOverride("_method"));

app.use(flash()); //Telling the app to use connect-flash

//SCHEMAS IN MODELS FILE NOW

//PASSPORT CONFIG
//================
app.use(require("express-session")({
	secret: "Nora is still the cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //method comes with passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ADDING OUR OWN MIDDLEWARE  to send currentUser to every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next(); //important to move on
});

//TO USE ALL ROUTE FILES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes); //all cg routes start with /campgrounds, can remove from camgprounds.js and shorten code
app.use("/campgrounds/:id/comments", commentRoutes);

//Start server
app.listen(port, () => {
	console.log("YelpCamp server has started!")
});