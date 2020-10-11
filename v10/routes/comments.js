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
                    //add username and id to comment
                    //console.log("New comment's username will be: " + req.user.username); 
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //Pushing comment to campground
                    campground.comments.push(comment);
                    //Saving cg
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

//COMMENTS EDIT = SHOW EDIT FORM ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
       if(err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", checkCommentOwnership, (req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next) {
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

module.exports = router; //Returning router variable