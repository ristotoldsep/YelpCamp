const user = require("../models/user");

const express = require("express"),
       router = express.Router(),
     passport = require("passport"),
         User = require("../models/user"),
   middleware = require("../middleware/index.js"); 


//================
//  ROOT ROUTE - landing page
//================

router.get("/", function (req, res) {
    res.render("landing");
});

//================
//  AUTH ROUTES
//================

//SHOW REGISTER FORM
router.get("/register", (req, res) => {
    res.render("register");
});

//HANDLE SIGNUP LOGIC
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render("register", { "error": err.message });
         //return - nice way to get out of callback
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//SHOW login form
router.get("/login", (req, res) => {
    res.render("login");
});

//HANDLE LOGIN LOGIC - Using middleware! 
//router.post("/login", middleware, callback);
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {
        //res.send("Login logic!");
    });

//LOGOUT ROUTE
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/campgrounds");
});

//MIDDLEWARE was here

module.exports = router; //Returning router variable