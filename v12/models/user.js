const mongoose              = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");

//Creating the data scheme for users
const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMongoose); //adding a bunch of methods that come with passport.js to our userSchema

module.exports = mongoose.model("User", UserSchema); //Exporting model

