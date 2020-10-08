var mongoose = require("mongoose");
//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [ //array of comment IDs
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Campground", campgroundSchema);