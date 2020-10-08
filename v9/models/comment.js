var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		},
		username: String
	}
});

module.exports = mongoose.model("Comment", commentSchema); //exporting schema
								