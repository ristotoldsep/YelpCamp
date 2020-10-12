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
                    console.log(err);
                    res.redirect("back");
                } else {
                    //Does user own the campground?
                    if (foundCampground.author.id.equals(req.user._id)) {
                        next();
                    } else {
                        res.redirect("back");
                    }
                }
            });
        } else {
            console.log("You need to be logged in!");
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
                        res.redirect("back");
                    }
                }
            });
        } else {
            console.log("You need to be logged in!");
            res.redirect("back"); // SEND USER TO PAGE THEY WERE ON LAST
        }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;