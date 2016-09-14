/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
//var logger = require('morgan');
var mongoose = require('mongoose');
// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');

// use morgan and bodyparser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));

// Database configuration with mongoose
var connection = process.env.MONGODB_URI || 'mongodb://localhost/meetupsdb';
mongoose.connect(connection);
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// And we bring in our Note and Article models
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Routes
// ======

// Simple index route
app.get('/', function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the echojs website.
app.get('/scrape', function(req, res) {
	// first, we grab the body of the html with request
  	request('http://www.meetup.com/topics/hacking/', function(error, response, html) {
	// then, we load that into cheerio and save it to $ for a shorthand selector
	    var $ = cheerio.load(html); 
		// now, we grab every div tag, and do the following:
		$(".gridList-item").each(function(i, element) {
		// save an empty result object
	        var result = {};
	        // add the text and href of every link, 
	        // and save them as properties of the result obj
	        result.title=$(this).find('h4').eq(0).text();
	        result.link = $(this).children('a').attr('href');
	        var bg = $(this).children('a').css('background-image');
	        bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
			result.image=bg;
			// using our Article model, create a new entry.
			// Notice the (result):
			// This effectively passes the result object to the entry (and the title, link and image)
			self = this;
			var entry = new Article(result);
			console.log(result);
			//Checking to not to enter duplicate data entries
			Article.count({'title': entry.title}, function (err, count){ 
	          if(count>0){
	              console.log('Already exists!');
	          }else{
	            // now, save that entry to the db
	            entry.save( function(err, doc) {
	              // log any errors
	              if (err) {
	                console.log(err);
	              } 
	              // or log the doc
	              else {
	                console.log(doc);
	              }
	            });
	          }
	        });
	        console.log(result.length);
    	}); 
    	// tell the browser that we finished scraping the text.
 		res.json("Scrape Complete");
 	 });
	
});

// this will get the articles we scraped from the mongoDB
app.get('/articles', function(req, res){
	// grab every doc in the Articles array
	Article.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});
// grab an article by it's ObjectId
app.get('/articles/:id', function(req, res){
	// using the id passed in the id parameter, 
	// prepare a query that finds the matching one in our db...
	Article.findOne({'_id': req.params.id})
	// and populate all of the notes associated with it.
	.populate('note')
	// now, execute our query
	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// otherwise, send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});
// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
app.post('/articles/:id', function(req, res){
	// create a new note and pass the req.body to the entry.
	var newNote = new Note(req.body);

	// and save the new note the db
	newNote.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
			// using the Article id passed in the id parameter of our url, 
			// prepare a query that finds the matching Article in our db
			// and update it to make it's lone note the one we just saved
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});                   
//delete the note from both collections (article and notes)
app.post('/delete/:id', function(req, res){
	Article.find({'_id': req.params.id}, 'note', function(err,doc){
	// .exec(function(err, doc){
		if (err){
			console.log(err);
		}
		//deletes the note from the Notes Collection
		Note.find({'_id' : doc[0].note}).remove().exec(function(err,doc){
			if (err){
				console.log(err);
			}
		});	
	});
	//deletes the note reference in the article document
	Article.findOneAndUpdate({'_id': req.params.id}, {$unset : {'note':1}})
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.send(doc);
		}
	});
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function() {
  console.log('App running on port 3000!');
});