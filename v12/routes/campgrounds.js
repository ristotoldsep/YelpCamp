const express = require("express"),
      router  = express.Router(),
   Campground = require("../models/campground"),
      Comment = require("../models/comment"),
   middleware = require("../middleware/index.js"); 

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//================
//  CAMPGROUND ROUTES
//================

// INDEX - Shows all Campgrounds
router.get("/", function (req, res) {
    if (req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({ name: regex }, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(allCampgrounds);
            }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function (err, allCampgrounds) {
            if (err) {
                console.log(err);
            } else {
                if (req.xhr) {
                    res.json(allCampgrounds);
                } else {
                    res.render("campgrounds/index", { campgrounds: allCampgrounds, page: 'campgrounds' });
                }
            }
        });
    }
});

//CREATE - creating new CG
router.post("/", middleware.isLoggedIn, function (req, res) {
    // 	get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;

    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author, price: price}; //New object 
    // campgrounds.push(newCampground); //Adding to array
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            // console.log(newlyCreated);
            //Redirect back to campgrounds site!
            res.redirect("/campgrounds");
            //console.log(newlyCreated);
        }
    });
});

//NEW - show form to add more CG-s
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

//SHOW - Will show info about specific CG (must come after "new", because : means anything after /campground)
router.get("/:id", function (req, res) {
    //find the CG with provided id
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) { //so we would get comments not just their id-s
        if (err || !foundCampground) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        } else {
            //render template with id info
            //console.log(foundCampground); 
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) =>{
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Deleted campground!");
            res.redirect("/campgrounds");
        }
    });
});

//MIDDLEWARE was here

module.exports = router; //Returning router variable