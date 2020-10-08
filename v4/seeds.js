var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [ //starter data, 3 different objects
	{
		name: "Lagedi Kool",
		image: "https://www.lagedi.edu.ee/wp-content/uploads/2016/01/Kooli-maja-846x340.jpg",
		description: "blablabla"
	}, 
	{
		name: "Lagedi Sild",
		image: "https://photos.wikimapia.org/p/00/01/00/91/89_big.jpg",
		description: "blablabla"
	},
	{
		name: "Lagedi Rongijaam",
		image: "https://p.ocdn.ee/53/i/2015/4/10/0bthrtfz.zla.jpg",
		description: "blablabla"
	}
]


function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds - looping through
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
module.exports = seedDB; //returning function