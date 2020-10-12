//ALL MIDDLEWARE FUNCTIONS GO HERE!!!
const middlewareObj = {},
Campground = require("../models/campground"),
Comment = require("../models/comment");

/* const middlewareObj = {
    checkCampgroundOwnership : function(){

    }
} */ 

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
        //Is user logged in?
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, (err, foundCampground) => {
                if (err) {
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    //Does user own the campground?
                    if (foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            /* console.log("You need to be logged in!"); */
            req.flash("error", "You need to be logged in to do that");
            res.redirect("back"); // SEND USER TO PAGE THEY WERE ON LAST
        }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
        //Is user logged in?
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    //Does user own the campground?
                    if (foundComment.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        req.flash("error", "You don't have permission to do that");
                        res.redirect("back");
                    }
                }
            });
        } else {
            //console.log("You need to be logged in!");
            req.flash("error", "You need to be logged in");
            res.redirect("back"); // SEND USER TO PAGE THEY WERE ON LAST
        }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); //If user is logged in, keep doing what was done before
    }
    //otherwise, depict error message
    req.flash("error", "You need to be logged in to do that"); //Not showing anything right away, ables us to use it on next request - MUST BE B4 redirect
    res.redirect("/login");
}

module.exports = middlewareObj;