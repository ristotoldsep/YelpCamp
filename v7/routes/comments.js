const  express = require("express"),
        router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
       Comment = require("../models/comment");

//================
//COMMENTS ROUTES
//================

//COMMENTS NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    //finc campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

//COMMENTS CREATE ROUTE - this is called CALLBACK HELL
router.post("/", isLoggedIn, (req, res) => {
    //lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //console.log(req.body.comment); //Outputs object with author and text!!! Thanks to comment[text] syntax I wrote to new.ejs
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
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

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router; //Returning router variable