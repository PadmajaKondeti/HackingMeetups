// grab the articles as a json

 var BRNewsApp={
  articleList:[],
  currentArticle:0,
  start: function() {
    debugger
    var self= this;
    $.getJSON('/articles', function(data) {
      self.articleList = data;
      self.displayArticle();
    });
  },
  displayArticle: function() {
    //display the apropos information on the page
    var heading = "<h3>"+this.articleList[this.currentArticle].title +"<img src='http://image.nj.com/home/njo-media/width180/img/centraljersey_impact/photo/21071618-standard.jpg'>"
    $('#articles').html(heading)
    //$('#articles').append('<p data-id="' + this.BRNewsApp[this.currentArticle]._id + '">'+ this.BRNewsApp[this.currentArticle].title + '<br />'+ this.BRNewsApp[this.currentArticle].link + '</p>');
   },
    nextArticle: function(){
       this.currentArticle = this.currentArticle == this.articleList.length ? 0  :
       this.currentArticle +1;
      this.displayArticle();
    }
};
  // whenever someone clicks a p tag
$(document).ready(function() {
debugger

  $(document).on('click', 'p', function(){
    // empty the notes from the note section
    $('#notes').empty();
    // save the id from the p tag
    var thisId = $(this).attr('data-id');

    // now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId,
    })
      // with that done, add the note information to the page
      .done(function( data ) {
        console.log(data);
        // the title of the article
        $('#notes').append('<h2>' + data.title + '</h2>'); 
        // an input to enter a new title
        $('#notes').append('<input id="titleinput" name="title" >'); 
        // a textarea to add a new note body
        $('#notes').append('<textarea id="bodyinput" name="body"></textarea>'); 
        // a button to submit a new note, with the id of the article saved to it
        $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

        // if there's a note in the article
        if(data.note){
          // place the title of the note in the title input
          $('#titleinput').val(data.note.title);
          // place the body of the note in the body textarea
          $('#bodyinput').val(data.note.body);
        }
      });
  });

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
        $('#notes').empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $('#titleinput').val("");
    $('#bodyinput').val("");
  });

// // when the #clearall button is pressed
// $('#clearall').on('click', function(){
//   // make an AJAX GET request to delete the notes from the db
//   $.ajax({
//     type: "GET",
//     dataType: "json",
//     url: '/clearall',
//     // on a successful call, clear the #results section
//     success: function(response){
//       $('#results').empty();
//     }
//   });
// });
// when you click the StartNews button
  $(document).on('click', '#startNews', function(){
    alert('ff')
    debugger;
    BRNewsApp.start();
  });
  $(document).on('click', '#articles', function(){
    BRNewsApp.nextArticle();
  });
});