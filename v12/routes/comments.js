const  express = require("express"),
        router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
       Comment = require("../models/comment"),
    middleware = require("../middleware/index.js");

//================
//COMMENTS ROUTES
//================

//COMMENTS NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
    //lookup campground using id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //console.log(req.body.comment); //Outputs object with author and text!!! Thanks to comment[text] syntax I wrote to new.ejs
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong");
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
                    req.flash("success", "Added Comment");
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
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

//COMMENTS UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
       if(err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
   Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//MIDDLEWARE was here

module.exports = router; //Returning router variable