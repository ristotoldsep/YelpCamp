const express = require("express"),
      router  = express.Router(),
   Campground = require("../models/campground"); 

//================
//  CAMPGROUND ROUTES
//================

// INDEX - Shows all Campgrounds
router.get("/", function (req, res) {
    // console.log(req.user);
    //Need to get all campgrounds from DB!
    // res.render("campgrounds", {campgrounds: campgrounds});

    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(error);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

//CREATE - creating new CG
router.post("/", isLoggedIn, function (req, res) {
    // 	get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;

    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author}; //New object 
    // campgrounds.push(newCampground); //Adding to array
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            // console.log(newlyCreated);
            //Redirect back to campgrounds site!
            res.redirect("/campgrounds");
            console.log(newlyCreated);
        }
    });
});

//NEW - show form to add more CG-s
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW - Will show info about specific CG (must come after "new", because : means anything after /campground)
router.get("/:id", function (req, res) {
    //find the CG with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) { //so we would get comments not just their id-s
        if (err) {
            console.log(err);
        } else {
            //render template with id info
            //console.log(foundCampground); 
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT
router.get("/:id/edit", (req, res) => {
    res.render("campgrounds/edit", {campground: foundCampground});
});
//UPDATE


//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router; //Returning router variable