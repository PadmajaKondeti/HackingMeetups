// grab the articles as a json
$(document).on('ready', function (){

  var getArticles = {
    // Attributes
    articles: [],
    currentArticle: 0,
    //default images for the articles
    imagesrc:["http://i.istockimg.com/file_thumbview_approve/65986455/6/stock-illustration-65986455-escritorio-ocupado.jpg", 
             "http://image.shutterstock.com/display_pic_with_logo/253597/230705539/stock-photo-programming-code-abstract-screen-of-software-developer-computer-script-more-similar-in-my-230705539.jpg",
             "http://image.shutterstock.com/display_pic_with_logo/253597/234597538/stock-photo-software-developer-programming-code-abstract-computer-script-code-blue-color-more-similar-in-234597538.jpg"
    ],
    scrapeArticle: function() {
      // scrape the articles as a json
      var self = this;
      $.getJSON('/scrape', function(data) {
      })
      .done(function( data ) {
          console.log("scraped data");
          self.fetchArticle();
      })
      .fail(function(data){
        console.log("scrape failed");
      });
    },
    fetchArticle: function() {
      // grab the articles as a json and display the first article
      var self = this;
      $.getJSON('/articles', function(data) {
        //scrape data if there is no data
        if (data.length <= 0){
           self.scrapeArticle();
         } else {
          self.articles = data;
          // for each one
          self.showArticle();
        } ;       
      })
      .done(function(data){
        console.log("retrieval of articles");
      })
      .fail(function(articles){
        console.log("retrieval of articles failed");
      });
    },
    
    showArticle: function() {
      // Display the current Article
      //debugger
      if ((this.articles).length > 0){
        if (this.currentArticle == 0){
            $('#previousArticle').prop('disabled', true).removeClass('flat-primary-butt flat-outer-butt');
            $('#nextArticle').prop('disabled', false).addClass('flat-primary-butt flat-outer-butt');
        } else if (this.currentArticle == ((this.articles).length - 1)){
          $('#nextArticle').prop('disabled', true).removeClass('flat-primary-butt flat-outer-butt');
          $('#previousArticle').prop('disabled', false).addClass('flat-primary-butt flat-outer-butt');
        } else {
            $('#previousArticle').prop('disabled', false).addClass('flat-primary-butt flat-outer-butt');
            $('#nextArticle').prop('disabled', false).addClass('flat-primary-butt flat-outer-butt');
        }
        console.log(this.currentArticle, this.articles[this.currentArticle].image)
        var showimage=this.articles[this.currentArticle].image;  
        //get a random image from images array if it is their local image 
        if (showimage.indexOf('/img/journey/simple/no_photo') >= 0){
              showimage = this.imagesrc[Math.floor(Math.random() * (this.imagesrc).length)];
        } else {
          showimage=this.articles[this.currentArticle].image;  
        };
        var articleContent = "<div data-id='" + this.articles[this.currentArticle]._id +"'>"
        + '<h4>'+this.articles[this.currentArticle].title +'</h4><hr>'//+"</div>" // this.articles[this.currentArticle].image + "</p>";
        + '<p>' + this.articles[this.currentArticle].hackers +'</p>'
        + "<img style='width: 100%;' class='img-rounded' alt='article image' src ='" + showimage +"' /> </div>";
        
        console.log(articleContent);
        
        $('#articleLink').html('<a target="_blank" href="'+this.articles[this.currentArticle].link+'">' +this.articles[this.currentArticle].title );
        $('#savenote').attr('data-id', this.articles[this.currentArticle]._id);
        $('#deletenote').attr('data-id', this.articles[this.currentArticle]._id);

        //appending the article to the div - article
        $('#article').html(articleContent);
        getNotes(this.articles[this.currentArticle]._id);
        //make the content visible
        $("#articleContainer").css('visibility', 'visible');
        //hide the scrape and start buttons
        $(".scrapeShow").hide();
      }
    },
    nextArticle: function() {
      // Display the next article.  start from the beginning if there are no more articles, 
      this.currentArticle = this.currentArticle == (this.articles.length-1) ?
        0 : this.currentArticle + 1;
      this.showArticle();
    },
     previousArticle: function() {
      // Display the next article.  start from the beginning if there are no more articles, 
      this.currentArticle =  this.currentArticle - 1;
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
    .done(function( data ) {
      console.log(data);
      // the title of the article
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
  // to scrape data
  $(document).on('click', '#startScrape', function(){
    getArticles.scrapeArticle();
    // $(".scrapeShow h3").text("View Details")
    // $(this).hide();
  });
  //to start showing the articles
  $(document).on('click', '#startNews', function(){
    getArticles.fetchArticle();
  });
  //to get next article
  $(document).on('click', '#article', function(){
    getArticles.nextArticle();
  });
  $(document).on('click', '#nextArticle', function(){
    getArticles.nextArticle();
  });
  $(document).on('click', '#previousArticle', function(){
    getArticles.previousArticle();
  });
});
