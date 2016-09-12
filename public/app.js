// grab the articles as a json
$(document).on('ready', function (){

  var getArticles = {
    // Attributes
    articles: [],
    currentArticle: 0,
    imagesrc:["https://danceswithfat.files.wordpress.com/2011/08/victory.jpg", 
          "http://s2.quickmeme.com/img/ea/eab5afc4bfb52ccd3656aa60daadafe63fc4b65147a15766b4d43ba96c89f20f.jpg",
          "https://i.imgflip.com/g3lqz.jpg",
          "http://s2.quickmeme.com/img/ac/ac449c4293b246b8662ddd0627279fcdaebe2c0d420f8838118235a81f47edc0.jpg",
          "http://cf.chucklesnetwork.agj.co/items/5/5/9/6/0/one-does-not-simply-declare-victory-but-i-just-did.jpg",
          "https://s-media-cache-ak0.pinimg.com/736x/e2/16/15/e2161543fb07fbef4f3b8748567fdbb1.jpg",
          "https://cdn.meme.am/instances/48501883.jpg",
          "http://lambopower.com/forum/uploads/monthly_06_2015/post-51915-1434235449.jpg"
          ],
    // Methods
    fetchArticle: function() {
      // grab the articles as a json
      // display the first article
      var self = this;
      debugger
      $.getJSON('/articles', function(data) {
          self.articles = data;
          // for each one
          self.showArticle();
      });
    },
    //Scrape article
    scrapeArticle: function() {
      // grab the articles as a json
      // display the first article
      var self = this;
      $.getJSON('/scrape', function(data) {
          //self.articles = data;
          // for each one
      })
      .done(function( data ) {
          //self.fetchArticle();
          console.log("scraped data");
      });
    },
    showArticle: function() {
      // Display the current Article
      // var heading = "<div style='background-image: url("+
      //  this.articles[this.currentArticle].image +
      // ")' data-id='" + this.articles[this.currentArticle]._id +"'>"//+ "' background-image='" 
      var showimage=this.articles[this.currentArticle].image;
    
      if (showimage.indexOf('/img/journey/simple/no_photo') >= 0){
            showimage = this.imagesrc[Math.floor(Math.random() * (this.imagesrc).length)];
      };
      var heading = "<div data-id='" + this.articles[this.currentArticle]._id +"'>"//+ "' background-image='" 

     // + this.articles[this.currentArticle].image +"'> "
      + '<h4>'+this.articles[this.currentArticle].title +'</h4>'//+"</div>" // this.articles[this.currentArticle].image + "</p>";
      + "<img style='height: 100%; width: 100%; object-fit: contain' class='img-rounded' alt='article image' src ='" + showimage +"' /> </div>";
      console.log(heading);
      $('#articleLink').html('<h2><a target="_blank" href="'+this.articles[this.currentArticle].link+'">' +this.articles[this.currentArticle].title+'</h2>' );
      $('#savenote').attr('data-id', this.articles[this.currentArticle]._id);
      $('#deletenote').attr('data-id', this.articles[this.currentArticle]._id);
      $('#article').html(heading);
      //debugger;
      getNotes(this.articles[this.currentArticle]._id);
    },
    nextArticle: function() {
      // Display the next article.  If there are no
      // more articles, start at the beginning
      this.currentArticle = this.currentArticle == this.articles.length ?
        0 : this.currentArticle + 1;
      this.showArticle();
    }
  };

  // whenever someone clicks a p tag
  var getNotes = function(data_id) {
    // empty the notes from the note section
    //$('#notes').empty();
    // save the id from the p tag
    //var thisId = $(p).attr('data-id');
    //this
     var thisId = data_id;
    $('#titleinput1').val("");
    $('#bodyinput1').val("");

    // now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
    })
    // with that done, add the note information to the page
    // .done(function( data ) {
    //   console.log(data);
    //   // the title of the article
    //   $('#notes').append('<h4><a href="' +data.link+ '">'+ data.title + '</a> </h4>'); 
    //   // an input to enter a new title
    //   $('#notes').append('<input id="titleinput" name="title" >'); 
    //   // a textarea to add a new note body
    //   $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
    //   // a button to submit a new note, with the id of the article saved to it
    //   $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
    //   // if there's a note in the article
    //   if(data.note){
    //     // place the title of the note in the title input
    //     $('#titleinput').val(data.note.title);
    //     // place the body of the note in the body textarea
    //     $('#bodyinput').val(data.note.body);

    //     //for delete
    //       $('#notes').append('<button data-id="' + data._id + '" id="deleteNote">Delete Note</button>');
    //   }
    // });
    // with that done, add the note information to the page
    .done(function( data ) {
      console.log(data);
      // the title of the article
      //$('#notes').append('<h4><a href="' +data.link+ '">'+ data.title + '</a> </h4>'); 
      // an input to enter a new title
      //$('#notes').append('<input id="titleinput" name="title" >'); 
      // a textarea to add a new note body
     // $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
      // a button to submit a new note, with the id of the article saved to it
     // $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');
      // if there's a note in the article
      if(data.note){
        // place the title of the note in the title input
        $('#titleinput1').val(data.note.title);
        // place the body of the note in the body textarea
        $('#bodyinput1').val(data.note.body);

        //$('#savenote').val(data._id);

        //for delete
         // $('#notes').append('<button data-id="' + data._id + '" id="deleteNote">Delete Note</button>');
      }
    });
  };
  // when you click the savenote button
  $(document).on('click', '#savenote', function(){
    // grab the id associated with the article from the submit button
    var thisId = $(this).attr('data-id');
    // run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $('#titleinput').val(), // value taken from title input
        body: $('#bodyinput').val() // value taken from note textarea
      }
    })
    // with that done
    .done(function( data ) {
      // log the response
      console.log(data);
      // empty the notes section
      //$('#notes').empty();
    });
    // Also, remove the values entered in the input and textarea for note entry
    $('#titleinput1').val($('#titleinput').val());
    $('#bodyinput1').val($('#bodyinput').val());
    $('#titleinput').val("");
    $('#bodyinput').val("");
  });
  // when user clicks the deleter button for a note
  $(document).on('click', '#deletenote', function(){
    // save the p tag that encloses the button
   var selected = $(this).attr('data-id');
   debugger
   // var selected = $(this).parent();
    console.log(selected);
    // make an AJAX GET request to delete the specific note 
    // this uses the data-id of the p-tag, which is linked to the specific note
    $.ajax({
      type: "POST",
      url: '/delete/' + selected
    })
    // Code to run if the request succeeds (is done);
    // The response is passed to the function
    .done(function( data ) {
       //selected.remove();
       $(this).attr('data-id','');
    })//,
    .fail(function( xhr, status, errorThrown ) {
      alert( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
    })
    // Also, remove the values entered in the input and textarea for note entry
     $('#titleinput').val("");
     $('#bodyinput').val("");
    $('#titleinput1').val("");
     $('#bodyinput1').val("");
  });

  // when you click the savenote button
  $(document).on('click', '#startScrape', function(){
    getArticles.scrapeArticle();
    $(this).hide();
  });
  $(document).on('click', '#startNews', function(){
    $("#articleContainer").css('visibility', 'visible');
   // getArticles.scrapeArticle(); 
    getArticles.fetchArticle();
    $(".scrapeShow").hide();
  });
  $(document).on('click', '#article', function(){
    getArticles.nextArticle();
  });
});
